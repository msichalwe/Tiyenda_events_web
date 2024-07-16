'use server'

import { RegisterSchema } from '@/schemas'
import * as z from 'zod'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { generateVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values)

	if (!validatedFields.success) {
		return { error: 'Invalid fields' }
	}

	const { email, password, name } = validatedFields.data

	const hashedPassword = await bcrypt.hash(password, 10)

	const existingUser = await db.user.findUnique({
		where: {
			email,
		},
	})

	if (existingUser) {
		return { error: 'Email already in use' }
	}

	const user = await db.user.create({
		data: {
			name,
			email,
			hashedPassword: hashedPassword,
		},
	})

	await db.notifications.create({
		data: {
			userId: user.id,
		},
	})

	const verificationToken = await generateVerificationToken(email)

	await sendVerificationEmail(verificationToken.email, verificationToken.token)

	return { success: 'confirmation email sent!' }
}
