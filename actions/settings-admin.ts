'use server'

import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/token'
import { SettingsSchema } from '@/schemas'
import * as z from 'zod'
import bcrypt from 'bcryptjs'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser()

	if (!user) {
		return { error: 'Unauthorized' }
	}

	if (!values.id) {
		return { error: 'Missing ID' }
	}

	const dbUser = await getUserById(values.id)

	if (!dbUser) {
		return { error: 'Unauthorized' }
	}

	if (values.password && values.newPassword && dbUser.hashedPassword) {
		const passwordsMatch = await bcrypt.compare(
			values.password,
			dbUser.hashedPassword,
		)

		if (!passwordsMatch) {
			return { error: 'Incorrect Password' }
		}

		const hashedPassword = await bcrypt.hash(values.newPassword, 10)

		values.password = hashedPassword
		values.newPassword = undefined
	}

	await db.user.update({
		where: {
			id: dbUser.id,
		},
		data: {
			name: values.name,
			email: values.email,
			isTwoFactorEnabled: values.isTwoFactorEnabled,
			role: values.role,
			hashedPassword: values.password,
		},
	})

	return { success: 'Settings Updated' }
}
