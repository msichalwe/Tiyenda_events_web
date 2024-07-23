import { IconBadge } from '@/components/icon-badge'
import { db } from '@/lib/db'
import {
	Calendar,
	File,
	FileArchive,
	LayoutDashboard,
	Map,
	Ticket,
	User,
} from 'lucide-react'

import { redirect } from 'next/navigation'
import NameForm from './_components/name-form'
import DescriptionForm from './_components/description-form'
import ImageForm from './_components/image-form'
import CategoryForm from './_components/category-form'
import LocationForm from './_components/location-form'
import OrganizerForm from './_components/organizer-form'
import DateTimeForm from './_components/date-time-form'
import TicketForm from './_components/ticket-form'
import PublishToggle from './_components/publish-toggle'
import AttachmentsForm from './_components/attachment-form'
import { auth } from '@/auth'
import RefundPolicyForm from './_components/refund-policy-form'

export const revalidate = 0

const Event = async ({ params }: { params: { eventId: string } }) => {
	const session = await auth()

	if (!session?.user.id) {
		return redirect('/')
	}
	const event = await db.event.findUnique({
		where: {
			id: params.eventId,
		},
		include: {
			Ticket: {
				select: {
					id: true,
					name: true,
				},
			},
			gallery: true,
		},
	})

	const eventStatus = event?.isPublished

	const organizers = await db.organizer.findMany({
		where: {
			users: {
				some: {
					id: session?.user.id,
				},
			},
		},
	})

	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	})

	if (!event) {
		return redirect('/')
	}

	const requiredFields = [
		event.name,
		event.address,
		event.description,
		event.categoryId,
		event.startDate,
		event.address,
		event.image,
		event.organizerId,
	]

	const totalFields = requiredFields.length

	const completedFields = requiredFields.filter(Boolean).length

	const completionText = `(${completedFields}/${totalFields})`

	return (
		<div className="p-6">
			<div className="flex items-center justify-between ">
				<div className="flex flex-col gap-x-2 ">
					<h1 className="text-2xl font-medium">Event setup</h1>
					<span className="text-sm text-slate-700">
						Complete all fields {completionText}
					</span>
				</div>

				<div className="flex gap-x-6">
					{event.isPublished ? (
						<span className="text-green-500 font-medium bg-green-100 py-2 px-4 rounded">
							Published
						</span>
					) : (
						<span className="text-red-500 font-medium bg-red-100 py-2 px-4 rounded">
							Draft
						</span>
					)}
					{completedFields === totalFields && (
						<PublishToggle initialData={event} eventId={event.id} />
					)}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={LayoutDashboard} />
						<h2 className="text-xl">Customize your event</h2>
					</div>
					<NameForm initialData={event} eventId={event.id} />
					<DescriptionForm initialData={event} eventId={event.id} />
					<ImageForm initialData={event} eventId={event.id} />
					<CategoryForm
						initialData={event}
						eventId={event.id}
						options={categories.map((category) => ({
							label: category.name,
							value: category.id,
						}))}
					/>

					<div className="mt-10">
						<div className="flex items-center gap-x-2">
							<IconBadge icon={User} />
							<h2 className="text-xl">Organizer</h2>
						</div>
						<OrganizerForm
							initialData={event}
							eventId={event.id}
							options={organizers.map((organizer) => ({
								label: organizer.name,
								value: organizer.id,
							}))}
						/>
					</div>
				</div>
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={Map} />
						<h2 className="text-xl">Location</h2>
					</div>
					<div className="mt-2 w-5/6 mx-auto ">
						<div>
							<p className="text-sm text-slate-600 ">
								Help people in the area discover your event and let attendees
								know where to show up
							</p>
						</div>
						<LocationForm initialData={event} eventId={event.id} />
					</div>
					<div className="flex items-center gap-x-2 mt-10">
						<IconBadge icon={Calendar} />
						<h2 className="text-xl">Date and Time</h2>
					</div>
					<div className="mt-2 w-5/6 mx-auto ">
						<div>
							<p className="text-sm text-slate-600 ">
								Tell event-goers when your event starts and ends so they can
								make plans to attend
							</p>
						</div>
						<DateTimeForm initialData={event} eventId={event.id} />
					</div>
					<div className="flex items-center gap-x-2 mt-10">
						<IconBadge icon={Ticket} />
						<h2 className="text-xl">Tickets </h2>
					</div>
					<div className="mt-2 w-5/6 mx-auto ">
						<div>
							<p className="text-sm text-slate-600 ">
								Tell event-goers when your event starts and ends so they can
								make plans to attend
							</p>
						</div>
						<TicketForm initialData={event} eventId={event.id} />
					</div>
					<div>
						<div className="flex items-center gap-x-2 mt-10">
							<IconBadge icon={File} />
							<h2 className="text-xl">Event Gallery </h2>
						</div>
						<AttachmentsForm initialData={event} eventId={event.id} />
					</div>
					<div>
						<div className="flex items-center gap-x-2 mt-10">
							<IconBadge icon={FileArchive} />
							<h2 className="text-xl">Refund Policy </h2>
						</div>

						<RefundPolicyForm initialData={event} eventId={event.id} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Event
