import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EventsClient from './_components/client'
import { db } from '@/lib/db'
import { EventColumn } from './_components/columns'
import { format } from 'date-fns'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { redirect } from 'next/navigation'

export const revalidate = 0

const Events = async () => {
	const user = await getCurrentUser()

	if (user?.role !== 'ADMIN') {
		redirect('/')
	}

	const events = await db.event.findMany({
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
				<h1 className="text-4xl font-black mb-5">
					Events ({formattedEvents.length})
				</h1>
			</div>
			<EventsClient data={formattedEvents} />
		</div>
	)
}

export default Events
