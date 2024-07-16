import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const { name, userId } = body

		if (!name) {
			return new NextResponse('Name is required', { status: 400 })
		}

		if (!userId) {
			return new NextResponse('User is required', { status: 400 })
		}

		const event = await db.event.create({
			data: {
				name,
				userId,
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log('[EVENTS]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(req: Request) {
	try {
		const events = await db.event.findMany({
			where: {
				isPublished: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				Category: {
					select: {
						id: true,
						name: true,
						description: true,
					},
				},
				organizer: {
					select: {
						id: true,
						name: true,
						description: true,
					},
				},
			},
		})

		return NextResponse.json(events)
	} catch (error) {
		console.log('[EVENTS]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
