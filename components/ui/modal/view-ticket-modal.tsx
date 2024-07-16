'use client'

import { useViewTicketModal } from '@/hooks/user-view-modal'
import { Modal } from './modal'
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface ViewTicketProps {
	ticketId: string
}

const ViewTicketModal: React.FC<ViewTicketProps> = ({ ticketId }) => {
	const viewTicketModal = useViewTicketModal()

	return (
		<Modal
			title="View Ticket"
			description=""
			isOpen={viewTicketModal.isOpenTicket}
			onClose={viewTicketModal.onCloseTicket}>
			{/* <div
				className="h-[600px] w-[400px] relative bg-cover bg-center bg-no-repeat
            "
				style={{ background: `url('/assets/ticket-bg.png')` }}>
				<div className="absolute w-4/5 space-y-2 top-52 right-10 px-4  flex flex-col py-2">
					<div className="space-y-2">
						<p className="text-sm text-gray-500">Name</p>
						<p className="p-medium-14">{tickets[0].user.name}</p>
					</div>
					<div className="space-y-2">
						<p className="text-sm text-gray-500">Ticket</p>
						<p className="p-medium-14 uppercase">{tickets[0].ticket.name}</p>
					</div>
					<div className="space-y-2">
						<p className="text-sm text-gray-500">Event</p>
						<p className="p-medium-14">{tickets[0].order.event.name}</p>
					</div>

					<div className="space-y-2">
						<p className="text-sm text-gray-500">Date</p>
						<p className="p-medium-14">
							{format(new Date(tickets[0].order.event.startDate!), 'eeee')}•{' '}
							{format(new Date(tickets[0].order.event.startDate!), 'hh:mm a')}
						</p>
					</div>
					<div className="space-y-2">
						<p className="text-sm text-gray-500">Location</p>
						<p className="p-medium-14">{tickets[0].order.event.address}</p>
					</div>
				</div>
			</div> */}
		</Modal>
	)
}

export default ViewTicketModal
