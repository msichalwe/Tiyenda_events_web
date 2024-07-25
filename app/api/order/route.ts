import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import qr from 'qrcode'
import { currentUser } from '@/lib/auth'

export async function POST(req: Request) {
	const user = await currentUser()

	try {
		const userId = user?.id

		const body = await req.json()

		const { fireBaseId, eventId, tickets, total, transactionToken } = body

		if (!transactionToken) {
			return new NextResponse('Transaction token is required', { status: 400 })
		}

		if (fireBaseId) {
			const mobileUserId = await db.user.findFirst({
				where: {
					fireBaseId,
				},
				select: {
					id: true,
				},
			})

			if (!mobileUserId) {
				return new NextResponse('Unauthorized', { status: 401 })
			}

			// Fetch the latest order
			const latestOrder = await db.order.findFirst({
				orderBy: {
					createdAt: 'desc',
				},
			})

			// Extract and increment the orderNumber
			let newOrderNumber = 1
			if (latestOrder) {
				newOrderNumber = latestOrder.orderNumber + 1
			}

			const order = await db.order.create({
				data: {
					userId: mobileUserId.id,
					eventId,
					total,
					orderNumber: newOrderNumber,
				},
			})

			for (const ticket of tickets) {
				for (let i = 0; i < ticket.quantity; i++) {
					const orderItem = await db.orderItem.create({
						data: {
							orderId: order.id,
							ticketId: ticket.id,
							userId: userId,
							qrcode: '',
							price: ticket.price,
						},
					})

					const qrcodeData = `${orderItem.id}`
					const qrcode = await qr.toDataURL(qrcodeData)

					await db.orderItem.update({
						where: {
							id: orderItem.id,
						},
						data: {
							qrcode,
						},
					})
				}
			}

			return NextResponse.json(order)
		} else {
			// Fetch the latest order
			const latestOrder = await db.order.findFirst({
				orderBy: {
					createdAt: 'desc',
				},
			})

			// Extract and increment the orderNumber
			let newOrderNumber = 1
			if (latestOrder) {
				newOrderNumber = latestOrder.orderNumber + 1
			}

			const order = await db.order.create({
				data: {
					userId: userId!,
					eventId,
					total,
					orderNumber: newOrderNumber,
				},
			})

			for (const ticket of tickets) {
				for (let i = 0; i < ticket.quantity; i++) {
					const orderItem = await db.orderItem.create({
						data: {
							orderId: order.id,
							ticketId: ticket.id,
							userId: userId,
							qrcode: '',
							price: ticket.price,
						},
					})

					const qrcodeData = `${orderItem.id}`
					const qrcode = await qr.toDataURL(qrcodeData)

					await db.orderItem.update({
						where: {
							id: orderItem.id,
						},
						data: {
							qrcode,
						},
					})
				}
			}

			const event = await db.event.findUnique({
				where: {
					id: eventId,
				},
			})

			const transaction = await db.transaction.create({
				data: {
					accRef: order.id,
					transactionToken: transactionToken,
					organizerId: event?.organizerId,
				},
			})

			return NextResponse.json(transaction)
		}
	} catch (error) {
		console.log('[ORDER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
