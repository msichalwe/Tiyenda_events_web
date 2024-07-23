import { create } from 'zustand'

interface useWithdrawalModalInterface {
	isOpenWithdrawal: boolean
	onOpenWithdrawal: () => void
	onCloseWithdrawal: () => void
}

export const useWithdrawalModal = create<useWithdrawalModalInterface>(
	(set) => ({
		isOpenWithdrawal: false,
		onOpenWithdrawal: () => set({ isOpenWithdrawal: true }),
		onCloseWithdrawal: () => set({ isOpenWithdrawal: false }),
	}),
)
