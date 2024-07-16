'use client'
import { Button } from '@/components/ui/button'
import WithdrawModal from '@/components/ui/modal/withdraw-modal'
import { useWithdrawalModal } from '@/hooks/use-withdrawal-modal'
import React from 'react'

const WithdrawalFundsButton = () => {
	const onOpen = useWithdrawalModal((state) => state.onOpenWithdrawal)

	return (
		<>
			<WithdrawModal />
			<Button onClick={onOpen}>Withdraw Funds</Button>
		</>
	)
}

export default WithdrawalFundsButton
