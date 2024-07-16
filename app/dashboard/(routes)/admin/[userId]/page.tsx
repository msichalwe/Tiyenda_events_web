import { Separator } from '@/components/ui/separator'
import { AccountForm } from './_components/account-form'
import { db } from '@/lib/db'

const UserSettings = async ({ params }: { params: { userId: string } }) => {
	const user = await db.user.findUnique({
		where: {
			id: params.userId,
		},
	})

	return (
		<div className="w-5/6 mx-auto p-10">
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Account</h3>
					<p className="text-sm text-muted-foreground">
						Update your account settings
					</p>
				</div>
				<Separator />
				<AccountForm user={user!} />
			</div>
		</div>
	)
}

export default UserSettings
