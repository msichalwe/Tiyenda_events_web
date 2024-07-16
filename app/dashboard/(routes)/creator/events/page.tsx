import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EventsClient from './_components/client'
import { db } from '@/lib/db'
import { EventColumn } from './_components/columns'
import { format } from 'date-fns'
import getCurrentUser from '@/app/actions/getCurrentUser'

export const revalidate = 0

const Events = async () => {
	const user = await getCurrentUser()

	const checkId = user?.id

	const events = await db.event.findMany({
		where: {
			userId: checkId,
		},
		include: {
			Order: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const formattedEvents: EventColumn[] = events.map((event) => {
		const startDay = format(new Date(event.startDate!), 'dd')
		const startDate = format(new Date(event.startDate!), 'eee, do MMMM, y')
		const startTime = format(new Date(event.startDate!), 'hh:mm a')
		const month = format(new Date(event.startDate!), 'MMM')

		return {
			id: event.id,
			name: event.name,
			location: event.address,
			image: event.image,
			isPublished: event.isPublished,
			startDate,
			startDay,
			sold: event.Order.length,
			startTime,
			month,
		}
	})

	return (
		<div className="p-6 space-y-6 w-5/6 mx-auto">
			<div className="w-full flex items-center justify-between">
				<h1 className="text-4xl font-black mb-5">My Events</h1>
				<Link href="/dashboard/creator/create">
					<Button>New Event</Button>
				</Link>
			</div>
			<EventsClient data={formattedEvents} />
		</div>
	)
}

export default Events
