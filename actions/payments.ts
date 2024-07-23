// @ts-nocheck
'use server'

import { ReceiptEmailHtml } from '@/components/emails/receipt-email'
import { transporter } from '@/config/nodemailer'
import { db } from '@/lib/db'
import { sendReceiptEmail } from '@/lib/mail'
import axios from 'axios'
import { format } from 'date-fns'
import convert from 'xml-js'

interface IGenerateToken {
	companyToken: string
	amount: number
	currency: string
	country: string
	redircetUrl: string
	serviceDescription: string
}

interface IVerifyToken {
	transactionToken: string
	companyRef?: string
}

type TransactionResponse = {
	Result: string
	ResultExplanation: string
	customerName: string
	customerCredit: string
	customerCreditType: string
	transactionApproval: string
	transactionCurrency: string
	transactionAmount: string
	fraudAlert: string
	fraudExplnation: string
	transactionNetAmount: string
	transactionSettlementDate: string
	transactionRollingReserveAmount: string
	transactionRollingReserveExpirationDate: string
	transactionRollingReserveDate: string
	customerPhone: string
	customerCountry: string
	customerAddress: string
	customerCity: string
	customerZip: string
	mobilePaymentRequest: string
	accRef: string
}

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
]

export const createToken = async ({
	companyToken,
	amount,
	currency,
	country,
	serviceDescription,
	redircetUrl,
}: IGenerateToken) => {
	let data = `
                <?xml version="1.0" encoding="utf-8"?>
                <API3G>
                <CompanyToken>${companyToken}</CompanyToken>
                <Request>createToken</Request>
                <Transaction>
                <PaymentAmount>${amount}</PaymentAmount >
                <PaymentCurrency>${currency}</PaymentCurrency>
                <DefaultPayment>MO</DefaultPayment>
                <DefaultPaymentCountry>${country}</DefaultPaymentCountry>
                <RedirectURL>${redircetUrl}</RedirectURL>
                <CompanyRefUnique>0</CompanyRefUnique>
                <PTL>5</PTL>
                </Transaction>
                <Services>
                <Service>
                <ServiceType>5525</ServiceType>
                    <ServiceDescription>${serviceDescription}</ServiceDescription>
                    <ServiceDate>${format(
											new Date(),
											'yyyy-MM-dd HH:mm',
										)}</ServiceDate>
                </Service>
                </API3G>
            `

	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://secure.3gdirectpay.com/API/v6/',
		headers: {
			'Content-Type': 'application/xml',
			Cookie: 'AFIDENT=0B6758B3-BB98-438A-A666-7BF2F9CA6B31',
		},
		data: data,
	}

	try {
		const token = await axios.request(config)
		return token.data
	} catch (error) {
		console.log(error)
		return error
	}
}

export default async function verifyToken({
	transactionToken,
	companyRef,
}: IVerifyToken) {
	const data = `
	<?xml version="1.0" encoding="utf-8"?>
	<API3G>
	<Request>verifyToken</Request>
	<CompanyToken>${process.env.DPO_COMPANY_TOKEN!}</CompanyToken>
	<TransactionToken>${transactionToken}</TransactionToken>
	<companyRef>${companyRef}</companyRef>
	</API3G>
    `
	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://secure.3gdirectpay.com/API/v6/',
		headers: {
			'Content-Type': 'application/xml',
		},
		data: data,
	}
	try {
		const response = await axios.request(config)
		const jsonResponse = convert.xml2js(response.data, {
			compact: false,
			alwaysChildren: true,
		})

		console.log(jsonResponse?.API3G?.Result?._text)

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
		]
		// @ts-ignore

		if (errorCodes.includes(jsonResponse?.API3G?.Result?._text)) {
			// @ts-ignore
			if (jsonResponse?.API3G?.Result?._text === '900') {
				return {
					error: 'Payment was not successful',
					url: `${process.env.NEXT_PUBLIC_DPO_PAYMENT_URL}${transactionToken}`,
				}
			}

			return {
				error: 'Oops Something went wrong.. Retry',
			}
		}

		const transaction = await db.transaction.findFirst({
			where: {
				transactionToken,
			},
		})

		if (!transaction) {
			return { error: 'Transaction not found' }
		}

		await db.transaction.update({
			where: {
				id: transaction.id,
			},
			data: {
				customerAddress: jsonResponse?.API3G?.CustomerAddress?._text,
				customerCity: jsonResponse?.API3G?.CustomerCity?._text,
				customerCountry: jsonResponse?.API3G?.CustomerCountry?._text,
				customerName: jsonResponse?.API3G?.CustomerName?._text,
				customerPhone: jsonResponse?.API3G?.CustomerPhone?._text,
				customerZip: jsonResponse?.API3G?.CustomerZip?._text,
				fraudAlert: jsonResponse?.API3G?.FraudAlert?._text,
				fraudExplnation: jsonResponse?.API3G?.FraudExplnation?._text,
				transactionAmount: jsonResponse?.API3G?.TransactionAmount?._text,
				transactionApproval: jsonResponse?.API3G?.TransactionApproval?._text,
				transactionCurrency: jsonResponse?.API3G?.TransactionCurrency?._text,
				transactionNetAmount: jsonResponse?.API3G?.TransactionNetAmount?._text,
				transactionSettlementDate:
					jsonResponse?.API3G?.TransactionSettlementDate?._text,
				customerEmail: jsonResponse?.API3G?.CustomerEmail?._text,
				mobilePaymentRequest: jsonResponse?.API3G?.MobilePaymentRequest?._text,
				result: jsonResponse?.API3G?.Result?._text,
				resultExplanation: jsonResponse?.API3G?.ResultExplanation?._text,
				transactionFinalAmount:
					jsonResponse?.API3G?.TransactionFinalAmount?._text,
				transactionFinalCurrency:
					jsonResponse?.API3G?.TransactionFinalCurrency?._text,
				transactionRolloingReserveAmount:
					jsonResponse?.API3G?.TransactionRollingReserveAmount?._text,
				transactionRolloingReserveDate:
					jsonResponse?.API3G?.TransactionRollingReserveDate?._text,
			},
		})

		const updatedOrder = await db.order.update({
			where: {
				id: transaction.accRef,
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

		if (!user) {
			return { error: 'User not found' }
		}

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
			to: user.email,
			subject: 'Your Tiyenda Receipt',
			html: ReceiptEmailHtml({
				email: user.email,
				date: updatedOrder.createdAt,
				orderId: updatedOrder.id,
				orderItems,
				orderNumber: updatedOrder.orderNumber,
			}),
		}

		await transporter.sendMail(options)

		return { success: 'Payment was successful' }
	} catch (error) {
		console.log(error)
		return { error: 'Payment was not successful' }
	}
}
