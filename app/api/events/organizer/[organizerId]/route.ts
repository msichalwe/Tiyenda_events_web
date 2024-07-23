import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { organizerId: string } },
) {
	try {
		const events = await db.event.findMany({
			where: {
				organizerId: params.organizerId,
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
