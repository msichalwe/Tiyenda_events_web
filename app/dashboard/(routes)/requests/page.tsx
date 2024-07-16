import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { format } from 'date-fns'
import { db } from '@/lib/db'

export const revalidate = 0

const RequestsPage = async () => {
	const pedningWithdrawals = await db.fundsRequst.findMany({
		where: {
			status: 'PENDING',
		},
		include: {
			organizer: {
				include: {
					Transaction: true,
				},
			},
		},
	})

	//other withdrawals that are not with the status of pending
	const completedWithdrawals = await db.fundsRequst.findMany({
		where: {
			status: 'APPROVED',
		},
		include: {
			organizer: {
				include: {
					Transaction: true,
				},
			},
		},
	})

	const formattedCompletedWithdrawals = completedWithdrawals.map(
		(withdrawal) => {
			const total = withdrawal.organizer?.Transaction.reduce(
				(acc, transaction) => {
					if (!transaction.transactionFinalAmount) return acc
					return acc + parseFloat(transaction.transactionFinalAmount!)
				},
				0,
			)
			return {
				id: withdrawal.id,
				amount: withdrawal.amount,
				status: withdrawal.status,
				date: format(withdrawal.createdAt, 'dd, MMM. yyyy'),
				name: withdrawal.organizer?.name,
				availableAmount: total,
			}
		},
	)

	const declinedWithdrawals = await db.fundsRequst.findMany({
		where: {
			status: 'DECLINED',
		},
		include: {
			organizer: {
				include: {
					Transaction: true,
				},
			},
		},
	})

	const formattedPendingWithdrawals = pedningWithdrawals.map((withdrawal) => {
		const total = withdrawal.organizer?.Transaction.reduce(
			(acc, transaction) => {
				if (!transaction.transactionFinalAmount) return acc
				return acc + parseFloat(transaction.transactionFinalAmount!)
			},
			0,
		)
		return {
			id: withdrawal.id,
			amount: withdrawal.amount,
			status: withdrawal.status,
			date: format(withdrawal.createdAt, 'dd, MMM. yyyy'),
			name: withdrawal.organizer?.name,
			availableAmount: total,
		}
	})
	return (
		<div className="p-6 space-y-6 h-screen mx-auto">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						Withdrawal Requests
					</h2>
				</div>
				<Tabs defaultValue="pending" className="space-y-10">
					<TabsList>
						<TabsTrigger value="pending">Pending</TabsTrigger>
						<TabsTrigger value="approved">Approved</TabsTrigger>
					</TabsList>
					<TabsContent value="pending">
						<DataTable columns={columns} data={formattedPendingWithdrawals} />
					</TabsContent>
					<TabsContent value="approved">
						<DataTable columns={columns} data={formattedCompletedWithdrawals} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default RequestsPage
