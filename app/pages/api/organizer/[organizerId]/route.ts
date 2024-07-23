import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(
	req: Request,
	{ params }: { params: { organizerId: string } },
) {
	try {
		const organizer = await db.organizer.findUnique({
			where: {
				id: params.organizerId,
			},
			include: {
				events: true,
			},
		})

		return NextResponse.json(organizer)
	} catch (error) {
		console.log('[ORGANISER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { organizerId: string } },
) {
	const session = await auth()
	try {
		const userId = session?.user?.id
		if (!userId) {
			return new NextResponse('Unathorized', { status: 401 })
		}

		const { organizerId } = params

		const values = await req.json()

		const organizer = await db.organizer.update({
			where: {
				id: organizerId,
			},
			data: {
				...values,
			},
		})

		return NextResponse.json(organizer)
	} catch (error) {
		console.log('[ORGANISER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
