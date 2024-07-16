import { Category, Event, Organizer, Ticket } from '@prisma/client'
import { format } from 'date-fns'
import { Heart, Share, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import FeatureConfirmation from './feature-confirmation'
import UnFeatureConfirmation from './unfeature-confirmation'
import { MotionDiv } from './motion-div'

export const revalidate = 0

export type EventCardProps = {
	event: Event & {
		Ticket: Ticket[]
		Category: Category
		organizer: Organizer
	}
	hasFeaturedToggle?: boolean
	index: number
}

const EventCard: React.FC<EventCardProps> = ({
	event,
	hasFeaturedToggle,
	index,
}) => {
	// Extract the Ticket array from eventData
	const tickets: Ticket[] = event.Ticket

	const validPrices: number[] = tickets
		.filter((ticket) => ticket.price !== null)
		.map((ticket) => Number(ticket.price)) // Convert string to number safely

	const lowestTicketPrice: number | undefined =
		validPrices.length > 0 ? Math.min(...validPrices) : undefined

	const variants = {
		hidden: {
			opacity: 0,
		},
		visible: {
			opacity: 1,
		},
	}

	return (
		<MotionDiv
			initial="hidden"
			animate="visible"
			transition={{
				delay: index * 0.25,
				ease: 'easeInOut',
				duration: 0.5,
			}}
			viewport={{ amount: 0 }}
			variants={variants}
			className="group relative flex min-h-[390px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
			<Link
				href={`/events/${event.id}`}
				style={{ backgroundImage: `url(${event.image})` }}
				className="flex-center flex-grow bg-gray-50 bg-center bg-cover text-grey-500"
			/>

			{hasFeaturedToggle ? (
				<div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl shadow-sm transition-all">
					{event.isFeatured ? (
						<UnFeatureConfirmation eventId={event.id} />
					) : (
						<FeatureConfirmation eventId={event.id} />
					)}
				</div>
			) : (
				<div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl shadow-sm transition-all">
					{/* <button className="bg-red-500 p-2 rounded-full text-white">
						<Heart className="w-5 h-5" />
					</button> */}
				</div>
			)}
			<Link
				href={`/events/${event.id}`}
				className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
				<div className="flex gap-2">
					<span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-500">
						{lowestTicketPrice ? `ZMW${lowestTicketPrice}` : 'Free'}
					</span>
					<p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500">
						{event.Category.name}
					</p>
				</div>
				<p className="p-medium-14  text-gray-500">
					{format(new Date(event.startDate!), 'do MMM yyyy')}•{' '}
					{format(new Date(event.startDate!), 'hh:mm a')}
				</p>
				<p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
					{event.name}
				</p>
				<p className="text-gray-500 text-xs">{event.address}</p>
				<div className="flex-between w-full">
					<p className="p-medium-14  text-gray-600">
						Organizer: {event.organizer.name}
					</p>
				</div>
			</Link>
		</MotionDiv>
	)
}

export default EventCard
