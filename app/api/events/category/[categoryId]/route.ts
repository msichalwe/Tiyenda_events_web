import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { categoryId: string } },
) {
	try {
		const events = await db.event.findMany({
			where: {
				categoryId: params.categoryId,
			},
			include: {
				Category: true,
				organizer: true,
				gallery: true,
			},
		})

		return NextResponse.json(events)
	} catch (error) {
		console.log('[CATEGORY]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
