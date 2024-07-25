import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { format, isValid } from 'date-fns'
import { auth } from '@/auth'

export async function PATCH(
	req: Request,
	{ params }: { params: { eventId: string } },
) {
	const session = await auth()
	try {
		const userId = session?.user?.id
		if (!userId) {
			return new NextResponse('Unathorized', { status: 401 })
		}
		const { eventId } = params

		const values = await req.json()

		let formattedStartDate,
			formattedEndDate,
			formattedStartTime,
			formattedEndTime

		if (values.startDate && isValid(new Date(values.startDate))) {
			formattedStartDate = format(new Date(values.startDate), 'do MMM yyyy')
		}

		if (values.endDate && isValid(new Date(values.endDate))) {
			formattedEndDate = format(new Date(values.endDate), 'do MMM yyyy')
		}

		if (values.startDate && isValid(new Date(values.startDate))) {
			formattedStartTime = format(new Date(values.startDate), 'hh:mm a')
		}

		if (values.endTime && isValid(new Date(values.endTime))) {
			formattedEndTime = format(new Date(values.endTime), 'hh:mm a')
		}
		const event = await db.event.update({
			where: {
				id: eventId,
				userId,
			},
			data: {
				...values,
				formattedStartDate,
				formattedEndDate,
				formattedStartTime,
				formattedEndTime,
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log('[EVENT_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { eventId: string } },
) {
	try {
		const event = await db.event.findUnique({
			where: {
				id: params.eventId,
			},
			include: {
				gallery: true,
				Ticket: true,
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log('[EVENT_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
