import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params }: { params: { invitationId: string } },
) {
	try {
		const invitation = await db.organizerInvitations.update({
			where: {
				id: params.invitationId,
			},
			data: {
				status: 'ACCEPTED',
			},
		})

		const user = await db.user.update({
			where: {
				id: invitation.userId,
			},
			data: {
				organizerId: invitation.organizerId,
				organizerRole: 'USER',
			},
		})

		return NextResponse.json(user, { status: 200 })
	} catch (error) {
		console.log('[INVITATION_ACCEPT]', error)
		return new NextResponse('Something went wrong', { status: 500 })
	}
}
