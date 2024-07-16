import { create } from 'zustand'

interface useOrderModalInterface {
	isOpenOrder: boolean
	onOpenOrder: () => void
	onCloseOrder: () => void
}

export const useOrderModal = create<useOrderModalInterface>((set) => ({
	isOpenOrder: false,
	onOpenOrder: () => set({ isOpenOrder: true }),
	onCloseOrder: () => set({ isOpenOrder: false }),
}))
