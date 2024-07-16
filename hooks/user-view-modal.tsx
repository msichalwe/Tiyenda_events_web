import { create } from 'zustand'

interface useViewTicketModalInterface {
	isOpenTicket: boolean
	onOpenTicket: () => void
	onCloseTicket: () => void
}

export const useViewTicketModal = create<useViewTicketModalInterface>(
	(set) => ({
		isOpenTicket: false,
		onOpenTicket: () => set({ isOpenTicket: true }),
		onCloseTicket: () => set({ isOpenTicket: false }),
	}),
)
