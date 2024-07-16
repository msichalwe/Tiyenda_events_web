import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params }: { params: { ticketId: string } },
) {
	try {
		const body = await req.json()

		const ticket = await db.ticket.update({
			where: {
				id: params.ticketId,
			},
			data: {
				...body,
			},
		})

		return NextResponse.json(ticket)
	} catch (error) {
		console.log('[TICKET_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { ticketId: string } },
) {
	try {
		const ticket = await db.ticket.findUnique({
			where: {
				id: params.ticketId,
			},
			include: {
				event: true,
			},
		})

		return NextResponse.json(ticket)
	} catch (error) {
		console.log('[TICKET_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
