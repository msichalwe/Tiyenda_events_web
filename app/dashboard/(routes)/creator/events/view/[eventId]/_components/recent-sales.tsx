import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const revalidate = 0

interface RecentSalesProps {
	id: string
}

const RecentSales: React.FC<RecentSalesProps> = async ({ id }) => {
	const user = await currentUser()

	const orders = await db.order.findMany({
		where: {
			event: {
				id: id,
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
				<div key={order.id} className="flex items-center">
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
					<div className="ml-auto font-medium">+K{order.total}</div>
				</div>
			))}
		</div>
	)
}

export default RecentSales
