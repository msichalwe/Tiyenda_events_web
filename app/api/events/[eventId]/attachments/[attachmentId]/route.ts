import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function DELETE(
	req: Request,
	{ params }: { params: { eventId: string; attachmentId: string } },
) {
	const session = await auth()

	try {
		const userId = session?.user?.id
		if (!userId) {
			return new NextResponse('Unathorized', { status: 401 })
		}

		const eventOwner = await db.event.findUnique({
			where: {
				id: params.eventId,
				userId: userId,
			},
		})

		if (!eventOwner) {
			return new NextResponse('Unathorized', { status: 401 })
		}

		const attachment = await db.gallery.delete({
			where: {
				id: params.attachmentId,
				eventId: params.eventId,
			},
		})

		return NextResponse.json(attachment)
	} catch (error) {
		console.log('[ATTACHMENT]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
