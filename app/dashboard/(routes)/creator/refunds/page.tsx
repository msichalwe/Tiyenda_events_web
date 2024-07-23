import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { TicketIcon } from 'lucide-react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { format } from 'date-fns'

const Refunds = async () => {
	const user = await currentUser()

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
		include: {
			orderItem: {
				include: {
					user: true,
					order: {
						include: {
							event: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			},
		},
	})

	const approvedRefunds = refunds.filter(
		(refund) => refund.status === 'APPROVED',
	)

	const pendingRefunds = refunds.filter((refund) => refund.status == 'PENDING')
	const declinedRefunds = refunds.filter(
		(refund) => refund.status === 'DECLINED',
	)

	const formattedRefunds = refunds.map((refund) => {
		return {
			id: refund.id,
			name: refund.orderItem.user?.name,
			event: refund.orderItem.order.event.name,
			amount: refund.amount,
			status: refund.status,
			date: format(new Date(refund.createdAt), 'do, MMM yyyy'),
		}
	})

	return (
		<div className="p-6 space-y-6  mx-auto">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Refunds</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-5 ">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Requests
							</CardTitle>
							<TicketIcon className="text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{refunds.length}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pending Requests
							</CardTitle>
							<TicketIcon className="text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{pendingRefunds.length}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Approved Requests
							</CardTitle>
							<TicketIcon className="text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{approvedRefunds.length}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Declined Requests
							</CardTitle>
							<TicketIcon className="text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{declinedRefunds.length}</div>
							<p className="text-xs text-muted-foreground"></p>
						</CardContent>
					</Card>
				</div>
				<div className="">
					<DataTable columns={columns} data={formattedRefunds} />
				</div>
			</div>
		</div>
	)
}

export default Refunds
