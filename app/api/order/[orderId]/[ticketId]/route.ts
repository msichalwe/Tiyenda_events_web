import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { ticketId: string; orderId: string } },
) {
	try {
		const tickets = await db.orderItem.findMany({
			where: {
				ticketId: params.ticketId,
				orderId: params.orderId,
			},
			include: {
				ticket: true,
				order: {
					include: {
						event: {
							select: {
								name: true,
								startDate: true,
								endDate: true,
								address: true,
								location: true,
							},
						},
					},
				},
				user: true,
			},
		})

		return NextResponse.json(tickets)
	} catch (error) {
		console.log('[ORDER_ITEM]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
