import { ViewEvent } from '@/actions'
import getCurrentUser from '@/app/actions/getCurrentUser'
import FollowButton from '@/app/components/follow-button'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'

import { differenceInHours, differenceInMinutes, format } from 'date-fns'
import {
	CalendarClock,
	Clock,
	Loader2,
	Mail,
	Map,
	PhoneCall,
	Ticket as TicketIcon,
} from 'lucide-react'

import { SocialIcon } from 'react-social-icons'
import BuyTicket from './_components/buy-tickets'
import AddressContainer from './_components/address-container'
import { Ticket } from '@prisma/client'

export const revalidate = 0

const Event = async ({ params }: { params: { eventId: string } }) => {
	const event = await db.event.findUnique({
		where: {
			id: params.eventId,
		},
		include: {
			organizer: true,
			Ticket: true,
		},
	})


	if (!event) {
		return (
			<div className="h-screen flex justify-center items-center">
				<Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
			</div>
		)
	}

	const currentUser = await getCurrentUser()

	const views = await ViewEvent(params.eventId)

	const startTime = new Date(event?.startDate!)
	const endTime = new Date(event?.endDate!)

	const hours = differenceInHours(endTime, startTime)
	const minutes = differenceInMinutes(endTime, startTime) % 60

	const tickets: Ticket[] = event.Ticket

	// Filter out null values and find the lowest ticket price
	const validPrices: number[] = tickets
		.filter((ticket) => ticket.price !== null)
		.map((ticket) => parseFloat(ticket.price!.replace('ZMW', '').trim()))
		.filter((price) => !isNaN(price));


	console.log(validPrices);

	const lowestTicketPrice: number | undefined =
		validPrices.length > 0 ? Math.min(...validPrices) : undefined

	return (
		<>
			<img
				src="/assets/wave-bg.svg"
				className="h-full w-full absolute top-0 z-[-1]"
				alt=""
			/>
			<div className="md:w-5/6 w-full px-5 h-full min-h-screen mx-auto py-5">
				<div
					className={`mt-20 h-[50vh]    border border-gray-100  backdrop-blur-xl w-full sm:w-5/6 lg:w-4/6 mx-auto rounded-xl shadow-lg relative`}>
					<img
						src={event?.image!}
						className="h-full w-full md:w-5/6 mx-auto object-cover"
						alt=""
					/>
				</div>
				<div className="grid grid-cols-3 mt-10 pag-10 px-5 md:px-10 lg:px-20">
					<div className="col-span-2 space-y-12">
						<div>
							<h1 className="text-3xl md:text-5xl font-bold mt-10">
								{event?.name}
							</h1>
							<p className="text-slate-400 mt-5">{event?.description}</p>
						</div>
						<div className="bg-gray-50 rounded flex md:flex-row flex-col gap-x-6 items-center p-5">
							<img
								src={event?.organizer?.imageUrl! || '/assets/placeholder.png'}
								className="rounded-full h-[60px] w-[60px] object-contain border border-orange-600"
							/>
							<p className="">By {event?.organizer?.name}</p>
						</div>
						<div className="space-y-4">
							<h2 className="text-xl font-bold">Date and time</h2>
							<div className="flex items-center gap-x-2">
								<CalendarClock className="h-6 w-6" />
								<p className="text-sm font-medium">
									{format(new Date(event?.startDate!), 'eee, do MMMM, y')},{' '}
									{format(new Date(event?.startDate!), 'hh:mm a')} -{' '}
									{format(new Date(event?.endDate!), 'hh:mm a')}
								</p>
							</div>
						</div>
						<div className="space-y-4">
							<h2 className="text-xl font-bold">Location</h2>
							<div className="flex items-center gap-x-2">
								<Map className="h-6 w-6" />
								<AddressContainer
									location={event?.location!}
									address={event.address!}
								/>
							</div>
						</div>
						<div className="space-y-4">
							<h2 className="text-xl font-bold">About this event</h2>
							<div className="flex items-center gap-x-6">
								<div className="flex items-center gap-x-2">
									<Clock className="h-10 text-blue-500 w-10 p-2 rounded bg-gray-50" />
									<p className="text-sm font-medium">
										{hours} hours {minutes} minute(s)
									</p>
								</div>
								<div className="flex items-center gap-x-2">
									<TicketIcon className="h-10 text-blue-500 w-10 p-2 rounded bg-gray-50" />
									<p className="text-sm font-medium">Mobile eTicket</p>
								</div>
							</div>
							<p className="text-sm text-slate-500">{event?.description}</p>
						</div>
						{event.isRefundPolicy && (
							<div className="space-y-4">
								<h2 className="text-xl font-bold">Refund Policy</h2>
								<p className="text-sm text-slate-500">{event.refundPolicy}</p>
							</div>
						)}

						<div className="space-y-4 text-center">
							<h2 className="text-xl font-bold">About Organizer</h2>
							<div className="bg-gray-50 w-full min-h-[40vh] p-4 flex flex-col items-center justify-center space-y-6 ">
								<img
									src={event?.organizer?.imageUrl! || '/assets/placeholder.png'}
									className="rounded-full h-[80px] w-[80px] object-contain border border-orange-600"
								/>
								<div className="space-y-4">
									<p className="text-sm text-slate-500">Organized by</p>
									<h3 className="text-2xl font-medium">
										{event?.organizer?.name}
									</h3>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									<div className="flex items-center text-xs text-slate-500 hover:text-orange-600 gap-2">
										<PhoneCall className="h-5 w-5" />
										<p className="hover:cursor-pointer">
											{event?.organizer?.contactPhone}{' '}
										</p>
									</div>
									<div className="flex items-center text-xs text-slate-500 hover:text-orange-600 gap-2">
										<Mail className="h-5 w-5" />
										<p className="hover:cursor-pointer">
											{event?.organizer?.contactEmail}{' '}
										</p>
									</div>
								</div>
								<FollowButton
									currentUser={currentUser}
									organizerId={event?.organizer?.id!}
								/>
								<p>{event?.organizer?.description}</p>
								<div className="flex items-center gap-x-4">
									{event?.organizer?.x && (
										<SocialIcon url={event?.organizer?.x} className="mr-4" />
									)}
									{event?.organizer?.instagram && (
										<SocialIcon
											url={event?.organizer?.instagram}
											className="mr-4"
										/>
									)}
									{event?.organizer?.facebook && (
										<SocialIcon
											url={event?.organizer?.facebook}
											className="mr-4"
										/>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="col-span-1">
						{/* on scroll when reached 20% to the top of the window it should be fixed position and not more */}
						<div className="border flex flex-col justify-around items-center border-gray-200 p-5 rounded-xl w-5/6 mx-auto min-h-[20vh]">
							{event?.Ticket[0].type === 'paid'
								? `Get from ZMW${lowestTicketPrice}`
								: 'Free'}
							<BuyTicket />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Event
