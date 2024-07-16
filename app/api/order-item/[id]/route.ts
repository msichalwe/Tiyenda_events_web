import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await currentUser()

		if (!user) {
			return new NextResponse('Unauthorized', { status: 403 })
		}

		const orderItem = await db.orderItem.findUnique({
			where: {
				id: params.id,
			},
			include: {
				order: {
					include: {
						event: {
							select: {
								userId: true,
							},
						},
					},
				},
			},
		})

		if (!orderItem) {
			return new NextResponse('Not Ticket Found', { status: 404 })
		}

		if (orderItem.status === 'USED') {
			return new NextResponse('Already Used', { status: 400 })
		}

		if (orderItem.status === 'EXPIRED') {
			return new NextResponse('Already Expired', { status: 400 })
		}

		if (user.id !== orderItem.order.event.userId) {
			return new NextResponse('User does not own the event', { status: 400 })
		}

		await db.orderItem.update({
			where: {
				id: params.id,
			},
			data: {
				status: 'USED',
			},
		})

		return NextResponse.json(orderItem)
	} catch (error) {
		console.log('CHECK_IN_ERROR', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	console.log(params)
	try {
		const orderItem = await db.orderItem.findUnique({
			where: {
				id: params.id,
			},
			include: {
				ticket: true,
				order: {
					include: {
						event: true,
						user: true,
					},
				},
			},
		})

		return NextResponse.json(orderItem)
	} catch (error) {
		console.log('ORDER_ITEM_ERROR', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
