import { Separator } from '@/components/ui/separator'
import React from 'react'

import { currentUser } from '@/lib/auth'
import { AccountForm } from './_components/account-form'

const SettingsPage = async () => {
	const current = await currentUser()

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings.
				</p>
			</div>
			<Separator />
			{/* @ts-ignore */}
			<AccountForm user={current} />
		</div>
	)
}

export default SettingsPage
