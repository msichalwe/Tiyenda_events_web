import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 0

const RecentSales = async () => {
	const user = await currentUser()

	const orders = await db.order.findMany({
		where: {
			event: {
				organizerId: user?.organizerId,
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			user: true,
		},

		take: 5,
	})

	return (
		<div className="space-y-8">
			{orders.map((order) => (
				<Link
					href={`/dashboard/events/view/${order.eventId}/${order.id}`}
					key={order.id}
					className="flex items-center hover:bg-gray-100 transition hover:cursor-pointer">
					<Avatar>
						<AvatarImage src={order.user.image!} alt="avatar" />
						<AvatarFallback>
							{order.user.name!.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="ml-4 space-y-1">
						<p className="text-sm font-medium leading-none">
							{order.user.name}
						</p>
						<p className="text-sm text-muted-foreground">{order.user.email}</p>
					</div>
					<div className="ml-auto font-medium flex items-center justfiy-between space-x-2 ">
						<div className="p-2 rounded-md text-xs bg-gray-300 text-gray-500 mr-4">
							{order.status}
						</div>
						+K{order.total}
					</div>
				</Link>
			))}
		</div>
	)
}

export default RecentSales
