import { create } from 'zustand'

interface useAddMemberInterface {
	isAddMenuOpen: boolean
	onAddMenuOpen: () => void
	onAddMenuClose: () => void
}

export const useAddMemberModal = create<useAddMemberInterface>((set) => ({
	isAddMenuOpen: false,
	onAddMenuOpen: () => set({ isAddMenuOpen: true }),
	onAddMenuClose: () => set({ isAddMenuOpen: false }),
}))
