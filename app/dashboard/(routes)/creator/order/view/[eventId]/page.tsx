// @ts-nocheck
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Ticket } from 'lucide-react'
import Overview from './_components/overview'
import RecentSales from './_components/recent-sales'
import Sales from './_components/sales'

const EventView = async ({ params }: { params: { eventId: string } }) => {
	const user = await currentUser()

	const event = await db.event.findUnique({
		where: {
			id: params.eventId,
		},
		include: {
			Order: {
				include: {
					OrderItem: {
						select: {
							ticket: {
								select: {
									name: true,
									price: true,
								},
							},
						},
					},
				},
			},
		},
	})

	const orders = event?.Order

	const orderTotalSum = orders?.reduce((sum, order) => {
		const orderTotalNumber = Number(order.total) // Convert string to number
		return sum + orderTotalNumber
	}, 0)

	const formatOrders = (orders: any[]) => {
		const formattedOrders: any[] = []

		orders.forEach((order) => {
			const ticketPrices = {}

			order.OrderItem.forEach((item: any) => {
				const ticketName = item.ticket.name // Access ticket name correctly

				const price = parseFloat(item.ticket.price)

				if (ticketPrices[ticketName]) {
					ticketPrices[ticketName] += price
				} else {
					// Otherwise, create a new entry for the ticket name with its price
					ticketPrices[ticketName] = price
				}
			})

			// Use map to create entries for each ticket type
			const ticketEntries = Object.entries(ticketPrices).map(
				([name, value]) => ({ name, value }),
			)
			formattedOrders.push(...ticketEntries) // Spread to add multiple entries
		})

		return formattedOrders
	}

	const formattedOrders = formatOrders(orders!)

	return (
		<div className="p-6 space-y-6  mx-auto">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">{event?.name}</h2>
				</div>
				<Tabs defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="sales">Sales</TabsTrigger>
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
									{/* <p className="text-xs text-muted-foreground">
										+20.1% from last month
									</p> */}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Sold Tickets
									</CardTitle>
									<Ticket className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{orders?.length}</div>
									<p className="text-xs text-muted-foreground">
										2 from the last hour
									</p>
								</CardContent>
							</Card>
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Overview</CardTitle>
								</CardHeader>
								<CardContent className="pl-2">
									<Overview data={formattedOrders} />
								</CardContent>
							</Card>
							<Card className="col-span-4">
								<CardHeader>
									<CardTitle>Recent Sales</CardTitle>
									<CardDescription>
										You made {orders.length}{' '}
										{orders.length > 2 ? 'sales' : 'sale'}.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<RecentSales id={params.eventId} />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
					<TabsContent value="sales">
						<Sales eventId={params.eventId} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default EventView
