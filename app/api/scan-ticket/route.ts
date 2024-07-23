import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { ticketId, userId, fireBaseId } = body

		let userOrganizerId

		if (userId) {
			userOrganizerId = await db.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					organizerId: true,
					id: true,
				},
			})
		}

		if (fireBaseId) {
			userOrganizerId = await db.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					organizerId: true,
					id: true,
				},
			})
		}

		if (!userOrganizerId || !userOrganizerId.organizerId) {
			return new NextResponse('User not part of an organization', {
				status: 403,
			})
		}

		const existingOrganizer = await db.organizer.findFirst({
			where: {
				id: userOrganizerId.organizerId!,
			},
		})

		const orderItem = await db.orderItem.findFirst({
			where: {
				id: ticketId,
			},
		})

		if (!orderItem) {
			return new NextResponse('No ticket found', { status: 403 })
		}

		if (orderItem.status === 'USED') {
			return new NextResponse('Ticket has already been used.', { status: 403 })
		}

		if (orderItem.status === 'EXPIRED') {
			return new NextResponse('Ticket has already expired.', { status: 403 })
		}

		const order = await db.order.findUnique({
			where: {
				id: orderItem?.orderId,
			},
		})

		const orderEvent = await db.event.findUnique({
			where: {
				id: order?.eventId,
			},
		})

		if (orderEvent?.organizerId !== existingOrganizer?.id) {
			return new NextResponse('Organizer does not own this event', {
				status: 403,
			})
		}

		await db.orderItem.update({
			where: {
				id: ticketId,
			},
			data: {
				status: 'USED',
			},
		})

		return new NextResponse('Ticket Scanned', { status: 200 })
	} catch (error) {
		console.log('[TICKET_SCAN]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
