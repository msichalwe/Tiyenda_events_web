import { NextResponse } from 'next/server'
import { type TransactionResponse } from '@/types/index'
import { auth } from '@/auth'
import { currentUser } from '@/lib/auth'
import { format } from 'date-fns'
import axios from 'axios'
import convert from 'xml-js'
import { db } from '@/lib/db'
import { ReceiptEmailHtml } from '@/components/emails/receipt-email'

export async function POST(req: Request) {
	const user = await currentUser()

	try {
		const { eventId, total, fireBaseId } = await req.json()

		const event = await db.event.findUnique({
			where: {
				id: eventId,
			},
		})

		let existingUser

		if (fireBaseId) {
			existingUser = await db.user.findFirst({
				where: {
					fireBaseId,
				},
			})
		} else {
			existingUser = await db.user.findFirst({
				where: {
					email: user?.email,
				},
			})
		}

		const customerFirstName = existingUser?.name!.split(' ')[0] || ''
		const customerLastName = existingUser?.name!.split(' ')[1] || ''
		const customerAddress = existingUser?.address || ''
		const customerCity = existingUser?.city || ''
		const customerCountry = existingUser?.country || ''
		const customerEmail = existingUser?.email || ''
		const customerPhone = existingUser?.phoneNumber || ''

		const payment_payload = `
		<?xml version="1.0" encoding="utf-8"?>
		<API3G>
		<CompanyToken>${process.env.DPO_COMPANY_TOKEN}</CompanyToken>
		<Request>createToken</Request>
		<Transaction>
			<PaymentAmount>${total}</PaymentAmount>
			<PaymentCurrency>ZMW</PaymentCurrency>
			<CompanyRef>${eventId}</CompanyRef>
			<RedirectURL>${process.env.DPO_REDIRECT_URL}</RedirectURL>
			<customerFirstName>${customerFirstName}</customerFirstName>
			<customerLastName>${customerLastName}</customerLastName>
			<customerEmail>${customerEmail}</customerEmail>
			<customerAddress>${customerAddress}</customerAddress>
			<customerCity>${customerCity}</customerCity>
			<customerCountry>ZM</customerCountry>
			<customerPhone>${customerPhone}</customerPhone>	
			<customerZip>00000</customerZip>
			<CompanyRefUnique>0</CompanyRefUnique>
			<DefaultPayment>MO</DefaultPayment>
   			 <DefaultPaymentCountry>Zambia</DefaultPaymentCountry>
			<PTL>5</PTL>
		</Transaction>
		<Services>
		   <Service>
			<ServiceType>4622</ServiceType>
			<ServiceDescription>${event?.name}</ServiceDescription>
			<ServiceDate>${format(new Date(), 'yyyy/MM/dd HH:mm')}</ServiceDate>
		  </Service>
		</Services>
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

		const xmlResponse = await axios.request(config)
		const jsonResponse = convert.xml2json(xmlResponse.data, {
			compact: true,
			alwaysChildren: true,
		})

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

		if (errorCodes.includes(JSON.parse(jsonResponse)?.API3G?.Result?._text)) {
			// @ts-ignore

			return new NextResponse(
				JSON.parse(jsonResponse)?.API3G?.ResultExplanation._text,
				{
					status: 400,
				},
			)
		}

		return NextResponse.json({
			success: true,
			data: JSON.parse(jsonResponse),
		})
	} catch (error) {
		console.log('[PAYMENT_CREATE_TOKEN]', error)
		return new NextResponse('Oops something wet wrong.. Retry', { status: 500 })
	}
}
