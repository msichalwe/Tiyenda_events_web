'use client'

import { Button } from '@/components/ui/button'
import ViewTicketModal from '@/components/ui/modal/view-ticket-modal'
import { useViewTicketModal } from '@/hooks/user-view-modal'
import React from 'react'

interface ViewTicketProps {
	ticketId: string
}

const ViewTicket: React.FC<ViewTicketProps> = ({ ticketId }) => {
	const onOpen = useViewTicketModal((state) => state.onOpenTicket)

	return (
		<>
			<ViewTicketModal ticketId={ticketId} />
			<Button onClick={onOpen}>View Tickets</Button>
		</>
	)
}

export default ViewTicket
