import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { orderId: string } },
) {
	try {
		const order = await db.order.findUnique({
			where: {
				id: params.orderId,
			},
			include: {
				OrderItem: {
					include: {
						ticket: true,
					},
				},
				event: true,
				user: true,
			},
		})
		return NextResponse.json(order)
	} catch (error) {
		console.log('[ORDER_ID]', error)
		return new NextResponse('Something went wrong', { status: 500 })
	}
}
