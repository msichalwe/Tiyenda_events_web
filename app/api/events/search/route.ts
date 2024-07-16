import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

import url from 'url'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { query } = body

		const limit = 10

		const events = await db.event.findMany({
			where: {
				name: {
					contains: query,
					mode: 'insensitive',
				},
			},
			include: {
				Category: true,
				organizer: true,
				gallery: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
		})

		return NextResponse.json(events)
	} catch (error) {
		console.log('[SEARCH]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
