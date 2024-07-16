import { db } from '@/lib/db'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import TicketClient from '../../_components/ticket-client'
import { TicketCheck } from 'lucide-react'
import { redirect } from 'next/navigation'

const Ticket = async ({
	params,
}: {
	params: { orderId: string; ticketId: string }
}) => {
	const availableTickets = await db.orderItem.findMany({
		where: {
			ticketId: params.ticketId,
			orderId: params.orderId,
		},
		include: {
			ticket: true,
			order: {
				include: {
					event: {
						select: {
							name: true,
							startDate: true,
							endDate: true,
							address: true,
							location: true,
						},
					},
				},
			},
			user: true,
		},
	})

	const order = await db.order.findUnique({
		where: {
			id: params.orderId,
		},
		select: {
			orderNumber: true,
			user: true,
		},
	})

	const tickets = availableTickets.filter((item: any) => item.status !== 'USED')

	if (!order || !tickets) {
		return redirect('/')
	}

	return (
		<div className="min-h-screen p-6 space-y-6 w-5/6 mx-auto py-20">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">
					Order #{order?.orderNumber}
				</h2>
			</div>
			<div className="grid mt-10 gap-4 md:gap-14 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Buyer Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-center flex-col">
							<Avatar>
								<AvatarImage alt={order.user.name!} src={order.user.image!} />
								<AvatarFallback className="text-gray-900 font-black">
									{order.user.email!.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="text-center mt-2">
								<h2 className="font-semibold">{order.user?.email}</h2>
								<p className="text-gray-500">{order.user?.name}</p>
							</div>
							<div className="mt-2">
								<h2 className="font-medium text-center">Tickets</h2>

								<ul className="py-4 gap-4 text-gray-700 flex items-center justify-around">
									<li className="flex flex-col items-center justify-around">
										<TicketCheck className="h-6 w-6 text-orange-500 " />
										<div className="text-sm">
											Available: {availableTickets.length}
										</div>
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="col-span-4">
					<TicketClient
						orderNumber={order.orderNumber}
						data={tickets}
						title={tickets[0].order.event.name}
						user={tickets[0].user!}
					/>
				</Card>
			</div>
		</div>
	)
}

export default Ticket
