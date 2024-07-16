import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: Request) {
	try {
		const session = await auth()

		if (!session) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const body = await req.json()
		const { ticketLimit, eventId } = body

		if (!ticketLimit) {
			return new NextResponse('Ticket Limit is required', { status: 400 })
		}

		if (!eventId) {
			return new NextResponse('Event ID is required', { status: 400 })
		}

		const ticket = await db.ticket.create({
			data: {
				eventId,
				ticketLimit,
			},
		})

		return NextResponse.json(ticket)
	} catch (error) {
		console.log('[TICKET]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(req: Request) {
	try {
		const tickets = await db.ticket.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				event: {
					select: {
						id: true,
						name: true,
						description: true,
					},
				},
			},
		})

		return NextResponse.json(tickets)
	} catch (error) {
		console.log('[TICKET]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
