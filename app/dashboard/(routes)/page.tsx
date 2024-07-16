// @ts-nocheck
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ArrowBigUp, Calendar } from 'lucide-react'

import { redirect } from 'next/navigation'
import RecentSales from '../_components/recent-sales'
import Overview from '../_components/overview'
import { DataTable } from './creator/analytics/_components/data-table'
import { columns } from './creator/analytics/_components/columns'

const Dashboard = async () => {
	const user = await currentUser()

	if (user?.role !== 'ADMIN') {
		redirect('/')
	}

	const events = await db.event.findMany({})

	const currentDate = new Date()

	const upcomingEvents = await db.event.findMany({
		where: {
			organizerId: user?.organizerId,
			AND: {
				startDate: {
					gt: currentDate,
				},
			},
		},
	})

	const transactions = await db.transaction.findMany({
		where: {
			Order: {
				status: 'COMPLETED',
			},
		},
		include: {
			Order: {
				include: {
					event: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	})

	const formattedTransactions: Transaction[] = transactions.map(
		(transaction) => {
			return {
				id: transaction.id,
				name: transaction.customerName!,
				phoneNumber: transaction.customerPhone!,
				status: transaction.Order?.status!,
				event: transaction.Order?.event.name!,
				amount: transaction.transactionFinalAmount!,
				date: '',
			}
		},
	)

	const orders = await db.order.findMany({
		where: {
			event: {
				organizerId: user?.organizerId,
			},
			status: 'COMPLETED',
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const orderTotalSum = orders.reduce((sum, order) => {
		const orderTotalNumber = Number(order.total) // Convert string to number
		return sum + orderTotalNumber
	}, 0)

	const currentYear = new Date().getFullYear()

	const yearOrders = await db.order.findMany({
		where: {
			event: {
				organizerId: user?.organizerId,
			},
			createdAt: {
				gte: new Date(currentYear, 0, 1),
				lt: new Date(currentYear + 1, 0, 1),
			},
		},
		select: {
			total: true,
			createdAt: true,
		},
	})

	const filteredOrders = yearOrders.filter((order) => {
		return new Date(order.createdAt).getFullYear() === currentYear
	})

	const ordersPerMonth = {}

	for (const order of filteredOrders) {
		const month = new Date(order.createdAt).getMonth()
		if (!ordersPerMonth[month]) {
			ordersPerMonth[month] = {
				count: 0,
				total: 0,
			}
		}
		ordersPerMonth[month].count++
		ordersPerMonth[month].total += Number(order.total)
	}

	// Format data into desired structure
	const formattedData = Object.entries(ordersPerMonth).map(
		([monthNumber, monthData]) => ({
			name: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			][monthNumber],
			total: monthData.total,
		}),
	)

	return (
		<div className="p-6 space-y-6  mx-auto">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				</div>
				<Tabs defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="analytics">Transactions </TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Revenue
									</CardTitle>
									<p className="text-sm font-medium text-muted-foreground">
										ZMW
									</p>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">K{orderTotalSum}</div>
									<p className="text-xs text-muted-foreground">
										+20.1% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Events
									</CardTitle>
									<Calendar className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{events.length}</div>
									<p className="text-xs text-muted-foreground">
										2 from the last 24 hours
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Upcoming Events
									</CardTitle>
									<ArrowBigUp className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{upcomingEvents.length}
									</div>
									<p className="text-xs text-muted-foreground"></p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Sales
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground">
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{orders.length}</div>
									<p className="text-xs text-muted-foreground"></p>
								</CardContent>
							</Card>
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
							{/* <Card className="col-span-4">
								<CardHeader>
									<CardTitle>Overview</CardTitle>
								</CardHeader>
								<CardContent className="pl-2">
									<Overview data={formattedData} />
								</CardContent>
							</Card> */}
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Recent Sales</CardTitle>
									<CardDescription>
										You made {orders.length}{' '}
										{orders.length > 2 ? 'sales' : 'sale'}.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<RecentSales />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
					<TabsContent value="analytics">
						<div className="h-full flex-1 flex-col space-y-8 mt-8  flex">
							<DataTable data={formattedTransactions} columns={columns} />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default Dashboard
