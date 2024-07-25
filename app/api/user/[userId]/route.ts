import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { userId: string } },
) {
	try {
		const user = await db.user.findFirst({
			where: {
				fireBaseId: params.userId,
			},
		})

		return NextResponse.json(user)
	} catch (error) {
		console.log('[USER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { userId: string } },
) {
	try {
		const user = await db.user.deleteMany({
			where: {
				fireBaseId: params.userId,
			},
		})

		return NextResponse.json(user)
	} catch (error) {
		console.log('[USER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
