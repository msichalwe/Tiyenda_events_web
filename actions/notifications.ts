'use server'

import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NotificationSchema } from '@/schemas'
import * as z from 'zod'

export const notifications = async (
	values: z.infer<typeof NotificationSchema>,
) => {
	const user = await currentUser()

	if (!user) {
		return { error: 'Unauthorized' }
	}

	const dbUser = await getUserById(user.id!)

	if (!dbUser) {
		return { error: 'Unauthorized' }
	}

	if (!dbUser.nofications) {
		await db.notifications.create({
			data: {
				userId: dbUser.id,
				...values,
			},
		})
	} else {
		await db.notifications.update({
			where: {
				userId: dbUser.id,
			},
			data: {
				...values,
			},
		})
	}

	return { success: 'Notifications Updated' }
}
