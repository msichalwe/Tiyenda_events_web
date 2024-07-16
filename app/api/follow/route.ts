import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { fireBaseId } = body

		if (!fireBaseId) {
			return new NextResponse('No ID', { status: 403 })
		}

		const user = await db.user.findFirst({
			where: {
				fireBaseId,
			},
			select: {
				followedIds: true,
			},
		})

		if (!user) {
			return new NextResponse('No User Found', { status: 403 })
		}

		const followedOrganizers = await Promise.all(
			user.followedIds.map((id) => db.organizer.findUnique({ where: { id } })),
		)

		// Filter out any organizers that weren't found
		const foundOrganizers = followedOrganizers.filter((organizer) => organizer)

		return NextResponse.json(foundOrganizers)
	} catch (error) {
		console.log('[FOLLOWED ORGANIZERS]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
