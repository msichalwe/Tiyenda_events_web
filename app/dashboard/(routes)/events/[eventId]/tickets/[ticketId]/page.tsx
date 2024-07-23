import { db } from '@/lib/db'
import React from 'react'
import Ticket from './_components/ticket'

const TicketPage = async ({ params }: { params: { ticketId: string } }) => {
	const ticket = await db.ticket.findUnique({
		where: {
			id: params.ticketId,
		},
	})

	if (!ticket) return null

	return <Ticket ticket={ticket} />
}

export default TicketPage
