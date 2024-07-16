import { auth } from '@/auth'
import { db } from '@/lib/db'

import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{ params }: { params: { eventId: string } },
) {
	try {
		const session = await auth()
		const userId = session?.user?.id
		if (!userId) {
			return new NextResponse('Unathorized', { status: 401 })
		}
		const { eventId } = params

		const { url } = await req.json()

		const eventOwner = await db.event.findUnique({
			where: {
				id: eventId,
				userId: userId,
			},
		})

		if (!eventOwner) {
			return new NextResponse('Unathorized', { status: 401 })
		}

		const attachment = await db.gallery.create({
			data: {
				url,
				name: url.split('/').pop(),
				eventId: eventId,
			},
		})

		return NextResponse.json(attachment)
	} catch (error) {
		console.log('[ATTACHMENTS]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
