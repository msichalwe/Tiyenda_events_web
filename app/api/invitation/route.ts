import { transporter } from '@/config/nodemailer'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { userId, organizerId } = body

		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			throw new Error(' User ID is required')
		}

		const organizer = await db.organizer.findUnique({
			where: {
				id: organizerId,
			},
		})

		if (!organizer) {
			throw new Error('Organizer ID is required')
		}

		const invitation = await db.organizerInvitations.create({
			data: {
				userId,
				organizerId,
			},
		})

		let url = `${process.env.BASE_URL}/invitation/${invitation.id}`

		await transporter.sendMail({
			to: user.email!,
			subject: 'Organization Invitation',
			text: `Invitation to the Organization ${organizer?.name}`,
			html: ` <table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td align="center">
					<table width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 600px;">
						<tr>
							<td style="background-color: #007BFF; padding: 20px;">
								<h1 style="color: #fff; text-align: center;">Invitation</h1>
							</td>
						</tr>
						<tr>
							<td style="padding: 20px;">
								<p>Hello, ${user.name!}</p>
								<p>Click the link below to accept the invite to the organization ${
									organizer?.name
								}:</p>
								<p><a href="${url}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept</a></p>
								<p>If the button above doesn't work, you can also copy and paste the following URL into your browser:</p>
								<p>${url}</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>`,
		})

		return NextResponse.json('Invitation Sent', { status: 200 })
	} catch (error) {
		console.log('[INVITATION]', error)
		return new NextResponse('Something went wrong', { status: 500 })
	}
}
