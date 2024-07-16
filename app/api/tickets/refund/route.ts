import { db } from '@/lib/db'
import axios from 'axios'
import { NextResponse } from 'next/server'
import convert from 'xml-js'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { orderItemId } = body

		const orderItem = await db.orderItem.findUnique({
			where: {
				id: orderItemId,
			},
		})

		if (!orderItem)
			return new NextResponse('Order Item not found', { status: 400 })

		const refundRequest = await db.refundRequest.create({
			data: {
				amount: orderItem?.price!,
				orderItemId: orderItemId,
			},
		})

		await db.orderItem.update({
			where: {
				id: orderItemId,
			},
			data: {
				status: 'PENDING_REFUND',
			},
		})

		return NextResponse.json(refundRequest)
	} catch (error) {
		console.log('[REFUND_TICKET_ERROR]', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

export async function PATCH(req: Request) {
	try {
		const body = await req.json()

		const { refundId } = body

		const refundRequest = await db.refundRequest.findUnique({
			where: {
				id: refundId,
			},
		})

		if (!refundRequest) {
			return new NextResponse('Refund Request not found', { status: 400 })
		}

		const orderItem = await db.orderItem.findUnique({
			where: {
				id: refundRequest?.orderItemId,
			},
			include: {
				order: {
					include: {
						Transaction: true,
					},
				},
			},
		})

		if (!orderItem) {
			return new NextResponse('Order Item not found', { status: 400 })
		}

		const transactions = orderItem.order?.Transaction

		const transaction = transactions[transactions.length - 1]

		const payment_payload = `
		
		<?xml version="1.0" encoding="utf-8"?>
			<API3G>
				<Request>refundToken</Request>
				<CompanyToken>${process.env.DPO_COMPANY_TOKEN}</CompanyToken>
				<TransactionToken>${transaction.transactionToken}</TransactionToken>
				<refundAmount>${refundRequest.amount}</refundAmount>
				
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

		const xmlResponse = await axios.request(config)
		const jsonResponse = convert.xml2json(xmlResponse.data, {
			compact: true,
			alwaysChildren: true,
		})

		// @ts-ignore

		if (errorCodes.includes(jsonResponse?.API3G?.ResponseCode)) {
			// @ts-ignore

			return new NextResponse(jsonResponse?.API3G?.ResponseMessage, {
				status: 400,
			})
		}

		await db.refundRequest.update({
			where: {
				id: refundId,
			},
			data: {
				status: 'APPROVED',
			},
		})

		await db.orderItem.update({
			where: {
				id: refundRequest.orderItemId,
			},
			data: {
				status: 'REFUNDED',
			},
		})

		return new NextResponse('Refund Successful', { status: 200 })
	} catch (error) {
		console.log('[REFUND_TICKET_ERROR]', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
