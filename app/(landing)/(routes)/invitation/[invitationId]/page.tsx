import { db } from '@/lib/db'

import { redirect } from 'next/navigation'
import React from 'react'
import AcceptInvitation from '../_components/accept-invitation'
import Link from 'next/link'
import { auth } from '@/auth'

const Invitation = async ({ params }: { params: { invitationId: string } }) => {
	const session = await auth()

	if (!session) {
		redirect('/auth/login')
	}

	const invitation = await db.organizerInvitations.findUnique({
		where: {
			id: params.invitationId,
			userId: session.user.id,
			status: 'PENDING',
		},
	})
	if (!invitation) {
		return (
			<div className="h-[90vh] w-full py-10 flex items-center justify-center">
				No Valid Invitation Sent, Go to your
				<Link
					href="/dashboard/creator/organizers"
					className="text-blue-500 underline mr-2">
					{' '}
					organization
				</Link>
			</div>
		)
	}

	return (
		<div className="h-[90vh] w-full py-10 flex items-center justify-center">
			<AcceptInvitation
				data={invitation}
				organizerId={invitation.organizerId}
			/>
		</div>
	)
}

export default Invitation
