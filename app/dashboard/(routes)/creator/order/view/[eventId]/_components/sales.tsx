import { db } from '@/lib/db'
import OrdersClient from './client'
import { OrderColumn } from './columns'
import { format } from 'date-fns'

interface SalesProps {
	eventId: string
}

export const revalidate = 0

const Sales: React.FC<SalesProps> = async ({ eventId }) => {
	const orders = await db.order.findMany({
		where: {
			eventId: eventId,
		},
		include: {
			user: {
				select: {
					email: true,
				},
			},
			event: {
				select: {
					name: true,
				},
			},
			OrderItem: true,
		},
	})

	const formattedOrders: OrderColumn[] = orders.map((order) => {
		const date = format(new Date(order.createdAt), 'do MMMM yyyy')

		return {
			id: order.id,
			buyer: order.user.email!,
			date: date,
			tickets: order.OrderItem.length,
			total: order.total,
			orderNumber: order.orderNumber,
		}
	})

	return (
		<div>
			<OrdersClient data={formattedOrders} key={'buyer'} />
		</div>
	)
}

export default Sales
