import { NextResponse } from 'next/server'
import { type TransactionResponse } from '@/types/index'
import { auth } from '@/auth'
import { currentUser } from '@/lib/auth'
import { format } from 'date-fns'
import axios from 'axios'
import convert from 'xml-js'
import { db } from '@/lib/db'
import { ReceiptEmailHtml } from '@/components/emails/receipt-email'
import { transporter } from '@/config/nodemailer'

export async function POST(req: Request) {
	try {
		const { transactionToken, companyRef } = await req.json()

		const transaction = await db.transaction.findFirst({
			where: {
				transactionToken,
			},
		})

		if (!transaction) {
			return new NextResponse('Transaction  not found', { status: 404 })
		}

		const payment_payload = `
        <?xml version="1.0" encoding="utf-8"?>
        <API3G>
        <Request>verifyToken</Request>
        <CompanyToken>${process.env.DPO_COMPANY_TOKEN!}</CompanyToken>
        <TransactionToken>${transactionToken}</TransactionToken>
        <companyRef>${companyRef}</companyRef>
        <ACCref>${transaction.accRef}</ACCref>
        </API3G>
        `

		let config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: `${process.env.DPO_URL}`,
			headers: {
				'Content-Type': 'application/xml',
			},
			data: payment_payload,
		}

		const response = await axios.request(config)
		const jsonResponse = convert.xml2json(response.data, {
			compact: true,
			alwaysChildren: true,
		})

		const parsedResponse = JSON.parse(jsonResponse)

		const errorCodes = [
			'000',
			'001',
			'002',
			'003',
			'005',
			'007',
			'801',
			'802',
			'804',
			'900',
			'902',
			'903',
			'904',
			'950',
			'960',
		]
		// @ts-ignore

		if (errorCodes.includes(parsedResponse?.API3G?.Result?._text)) {
			// @ts-ignore

			return new NextResponse(parsedResponse?.API3G?.ResultExplanation._text, {
				status: 400,
			})
		}

		if (!transaction) {
			return new NextResponse('Transaction not found', { status: 400 })
		}

		await db.transaction.update({
			where: {
				id: transaction.id,
			},
			data: {
				customerAddress: parsedResponse?.API3G?.CustomerAddress?._text,
				customerCity: parsedResponse?.API3G?.CustomerCity?._text,
				customerCountry: parsedResponse?.API3G?.CustomerCountry?._text,
				customerName: parsedResponse?.API3G?.CustomerName?._text,
				customerPhone: parsedResponse?.API3G?.CustomerPhone?._text,
				customerZip: parsedResponse?.API3G?.CustomerZip?._text,
				fraudAlert: parsedResponse?.API3G?.FraudAlert?._text,
				fraudExplnation: parsedResponse?.API3G?.FraudExplnation?._text,
				transactionAmount: parsedResponse?.API3G?.TransactionAmount?._text,
				transactionApproval: parsedResponse?.API3G?.TransactionApproval?._text,
				transactionCurrency: parsedResponse?.API3G?.TransactionCurrency?._text,
				transactionNetAmount:
					parsedResponse?.API3G?.TransactionNetAmount?._text,
				transactionSettlementDate:
					parsedResponse?.API3G?.TransactionSettlementDate?._text,
				customerEmail: parsedResponse?.API3G?.CustomerEmail?._text,
				mobilePaymentRequest:
					parsedResponse?.API3G?.MobilePaymentRequest?._text,
				result: parsedResponse?.API3G?.Result?._text,
				resultExplanation: parsedResponse?.API3G?.ResultExplanation?._text,
				transactionFinalAmount:
					parsedResponse?.API3G?.TransactionFinalAmount?._text,
				transactionFinalCurrency:
					parsedResponse?.API3G?.TransactionFinalCurrency?._text,
				transactionRolloingReserveAmount:
					parsedResponse?.API3G?.TransactionRollingReserveAmount?._text,
				transactionRolloingReserveDate:
					parsedResponse?.API3G?.TransactionRollingReserveDate?._text,
			},
		})

		const updatedOrder = await db.order.update({
			where: {
				id: transaction.accRef!,
			},
			data: {
				status: 'COMPLETED',
			},
			include: {
				user: true,
			},
		})

		const user = await db.user.findUnique({
			where: {
				id: updatedOrder.userId,
			},
		})

		const orderItems = await db.orderItem.findMany({
			where: {
				orderId: updatedOrder.id,
			},
			include: {
				ticket: true,
			},
		})

		const options = {
			from: process.env.EMAIL_FROM,
			to: user?.email!,
			subject: 'Your Tiyenda Receipt',
			html: ReceiptEmailHtml({
				email: user?.email!,
				date: updatedOrder.createdAt,
				orderId: updatedOrder.id,
				orderItems,
				orderNumber: `${updatedOrder.orderNumber}`,
			}),
		}

		await transporter.sendMail(options)

		console.log(parsedResponse)

		return NextResponse.json(parsedResponse)
	} catch (error) {
		console.log('[PAYMENT_VERIFY_TOKEN]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
