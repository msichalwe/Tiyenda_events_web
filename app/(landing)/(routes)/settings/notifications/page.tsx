import { Separator } from '@/components/ui/separator'
import { NotificationsForm } from './notifications-form'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'

const Notification = async () => {
	const current = await currentUser()

	const user = await db.user.findUnique({
		where: {
			id: current?.id,
		},
		include: {
			nofications: true,
		},
	})

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Notifications</h3>
				<p className="text-sm text-muted-foreground">
					Configure how you receive notifications
				</p>
			</div>
			<Separator />
			<NotificationsForm data={user?.nofications!} />
		</div>
	)
}

export default Notification
