import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const events = await db.event.findMany({
			where: {
				isFeatured: true,
			},
			orderBy: {
				startDate: 'desc',
			},
		})

		return NextResponse.json(events)
	} catch (error) {
		console.log('[FEATURED]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
