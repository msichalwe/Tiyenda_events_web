import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
	req: Request,
	{ params }: { params: { userId: string } },
) {
	try {
		const userId = params.userId

		const user = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				organizerId: null,
			},
		})

		return NextResponse.json(user)
	} catch (error) {
		console.log('[REMOVE_USER_ERROR]', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
