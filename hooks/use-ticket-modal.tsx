import { create } from 'zustand'

interface useTicketModalInterface {
	isOpenTicket: boolean
	onOpenTicket: () => void
	onCloseTicket: () => void
}

export const useTicketModal = create<useTicketModalInterface>((set) => ({
	isOpenTicket: false,
	onOpenTicket: () => set({ isOpenTicket: true }),
	onCloseTicket: () => set({ isOpenTicket: false }),
}))
