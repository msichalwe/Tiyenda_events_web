import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'
import WithdrawalFundsButton from './_components/withdrawal-funds-button'
import { TicketIcon } from 'lucide-react'
import { format } from 'date-fns'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

const Funds = async () => {
	const user = await currentUser()

	const transactions = await db.transaction.findMany({
		where: {
			organizerId: user?.organizerId,
		},
	})

	const refunds = await db.refundRequest.findMany({
		where: {
			orderItem: {
				order: {
					event: {
						organizerId: user?.organizerId,
					},
				},
			},
		},
	})

	const withdrawals = await db.fundsRequst.findMany({
		where: {
			organizerId: user?.organizerId!,
		},
	})

	const pendingWithdrawals = withdrawals.filter(
		(withdrawal) => withdrawal.status === 'PENDING',
	)

	const withdrawnAmount = withdrawals.reduce((acc, withdrawal) => {
		if (withdrawal.status === 'APPROVED') {
			return acc + parseFloat(withdrawal.amount)
		}
		return acc
	}, 0)

	const refundedAmount = refunds.reduce((acc, refund) => {
		if (refund.status === 'APPROVED') {
			return acc + parseFloat(refund.amount)
		}
		return acc
	}, 0)

	const total = transactions.reduce((acc, transaction) => {
		const transactionAmount = transaction.transactionAmount || '0'
		return acc + parseFloat(transactionAmount)
	}, 0)

	const formattedWithdrawals = withdrawals.map((withdrawal) => {
		return {
			id: withdrawal.id,
			amount: withdrawal.amount,
			status: withdrawal.status,
			date: format(new Date(withdrawal.createdAt), 'do, MMM yyyy'),
			type: withdrawal.type,
		}
	})

	const availableBalance = total - withdrawnAmount - refundedAmount

	return (
		<div className="p-6 space-y-6 h-screen mx-auto">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Funds</h2>
					<WithdrawalFundsButton />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-5 ">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Revenue
							</CardTitle>
							<p className="text-muted-foreground text-sm uppercase">ZMW</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">K{total}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Available Balance
							</CardTitle>
							<p className="text-muted-foreground text-sm uppercase">ZMW</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">K{availableBalance}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Withdrawn amount
							</CardTitle>
							<p className="text-muted-foreground text-sm uppercase">ZMW</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">K{withdrawnAmount}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Refunded Amount
							</CardTitle>
							<p className="text-muted-foreground text-sm uppercase">ZMW</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">K{refundedAmount}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pending Withdrawals
							</CardTitle>
							<TicketIcon className="text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{pendingWithdrawals.length}
							</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
				</div>
				<div>
					<DataTable columns={columns} data={formattedWithdrawals} />
				</div>
			</div>
		</div>
	)
}

export default Funds
