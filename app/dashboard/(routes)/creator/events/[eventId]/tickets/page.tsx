'use client'
import TicketModal from '@/components/ui/modal/ticket-modal'
import { Separator } from '@/components/ui/separator'
import { useTicketModal } from '@/hooks/use-ticket-modal'
import { fetcher } from '@/lib/fetcher'
import { Ticket } from '@prisma/client'
import { Plus, Ticket as TicketIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

export const revalidate = 0

const CreateTicket = () => {
	const onOpen = useTicketModal((state) => state.onOpenTicket)
	const isOpen = useTicketModal((state) => state.isOpenTicket)

	const params = useParams()
	const router = useRouter()

	const { data: tickets, isLoading } = useSWR(
		`/api/tickets/${params.eventId}`,
		fetcher,
	)

	if (isLoading) return <div>Loading...</div>

	return (
		<>
			<TicketModal isOpen={isOpen} />
			<div className="w-5/6 mx-auto pt-16 space-y-6">
				<div className="flex justify-between ">
					<h1 className="text-5xl font-bold">Tickets</h1>
				</div>
				<Separator />
				<div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5">
					<div
						onClick={onOpen}
						className="border-blue-600 border cursor-pointer hover:bg-gray-50  max-w-xl min-h-[30vh] py-10 w-5/6 rounded-2xl flex flex-col items-center space-y-4 justify-center">
						<Plus className="w-14 h-14 text-blue-500 p-4 font-bold rounded-xl bg-blue-100" />
						<div className="text-center">
							<h2 className="text-2xl font-medium">Create new ticket</h2>
							<p>Start with a blank slate</p>
						</div>
					</div>
					{tickets.map((ticket: Ticket) => (
						<div
							key={ticket.id}
							onClick={() =>
								router.push(
									`/dashboard/creator/events/${params.eventId}/tickets/${ticket.id}`,
								)
							}
							className="hover:border-blue-600 border-gray-500 border cursor-pointer hover:bg-gray-50  max-w-xl min-h-[30vh] py-10 w-5/6 rounded-2xl flex flex-col items-center space-y-4 justify-center">
							{ticket.name}
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default CreateTicket
