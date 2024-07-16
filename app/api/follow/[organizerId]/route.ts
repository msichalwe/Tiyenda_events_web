import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
	req: Request,
	{ params }: { params: { organizerId: string } },
) {
	try {
		const { userId } = await req.json()

		const { organizerId } = params

		if (!organizerId || typeof organizerId !== 'string') {
			throw new Error('Organizer ID is required')
		}

		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
		})

		let followedIds = [...(user?.followedIds || [])]

		followedIds.push(organizerId)

		const updatedUser = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				followedIds,
			},
		})

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.log('[FOLLOW]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { organizerId: string } },
) {
	try {
		const { userId } = await req.json()
		const { organizerId } = params

		if (!organizerId || typeof organizerId !== 'string') {
			throw new Error('Organizer ID is required')
		}

		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
		})

		let followedIds = [...(user?.followedIds || [])]

		followedIds = followedIds.filter((id) => id !== organizerId)

		const updatedUser = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				followedIds,
			},
		})

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.log('[FOLLOW]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
