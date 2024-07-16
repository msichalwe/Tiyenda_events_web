import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { eventId: string } },
) {
	try {
		const ticket = await db.ticket.findMany({
			where: {
				eventId: params.eventId,
			},
		})

		return NextResponse.json(ticket)
	} catch (error) {
		console.log('[TICKET]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
