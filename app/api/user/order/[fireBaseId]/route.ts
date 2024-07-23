import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { fireBaseId: string } },
) {
	try {
		const user = await db.user.findFirst({
			where: {
				fireBaseId: params.fireBaseId,
			},
		})

		if (!user) {
			return new NextResponse('User not found', { status: 401 })
		}

		const orders = await db.order.findMany({
			where: {
				userId: user.id,
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

		return NextResponse.json(orders)
	} catch (error) {
		console.log('[USER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
