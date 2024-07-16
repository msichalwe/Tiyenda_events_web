import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: Request) {
	try {
		const session = await auth()

		if (!session) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const userId = session?.user?.id

		const body = await req.json()
		const { name } = body

		if (!name) {
			return new NextResponse('Name is required', { status: 400 })
		}

		const organizer = await db.organizer.create({
			data: {
				name,
			},
		})

		await db.user.update({
			where: {
				id: userId,
			},
			data: {
				organizerId: organizer.id,
			},
		})

		return NextResponse.json(organizer)
	} catch (error) {
		console.log('[ORGANISER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(req: Request) {
	try {
		const organizers = await db.organizer.findMany({
			include: {
				events: true,
			},
		})

		return NextResponse.json(organizers)
	} catch (error) {
		console.log('[ORGANISER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
