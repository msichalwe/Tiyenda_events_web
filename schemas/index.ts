import { NotifyMeOpts, UserRole, RequestTypes } from '@prisma/client'
import * as z from 'zod'

export const NotificationSchema = z.object({
	notify_me: z.enum(
		[NotifyMeOpts.all, NotifyMeOpts.favorite, NotifyMeOpts.none],
		{
			required_error: 'You need to select a notification type.',
		},
	),

	communication_mail: z.boolean().default(false).optional(),
	marketing_mail: z.boolean().default(false).optional(),
	security_mail: z.boolean(),
})
export const SettingsSchema = z
	.object({
		id: z.optional(z.string()),
		name: z.optional(z.string()),
		email: z
			.string()
			.email({
				message: 'Invalid Email',
			})
			.optional(),
		image: z.string().optional(),
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
		role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
		isTwoFactorEnabled: z.boolean().default(false).optional(),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false
			}

			return true
		},
		{
			message: 'New password is required!',
			path: ['newPassword'],
		},
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false
			}

			return true
		},
		{
			message: 'Password is required!',
			path: ['password'],
		},
	)
export const PublicSettingsSchema = z
	.object({
		id: z.optional(z.string()),
		name: z.optional(z.string()),
		email: z
			.string()
			.email({
				message: 'Invalid Email',
			})
			.optional(),
		image: z.string().optional(),
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
		phoneNumber: z.optional(z.string()),
		isTwoFactorEnabled: z.boolean().default(false).optional(),
		address: z.optional(z.string()),
		city: z.optional(z.string()),
		country: z.optional(z.string()),
		zip: z.optional(z.string()),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false
			}

			return true
		},
		{
			message: 'New password is required!',
			path: ['newPassword'],
		},
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false
			}

			return true
		},
		{
			message: 'Password is required!',
			path: ['password'],
		},
	)

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(1, {
		message: 'Password is required',
	}),

	code: z.optional(z.string()),
})
export const NewPasswordSchema = z.object({
	password: z.string().min(6, {
		message: 'Minimum of 6 characters required',
	}),
})

export const ResetSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
})
export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(6, {
		message: 'Minimum of 6 characters required',
	}),
	name: z.string().min(1, {
		message: 'Name is required',
	}),
})

export const WithdrawalSchema = z.object({
	amount: z.string().min(1, 'Amount is required'),
	bankName: z.optional(z.string()),
	accountName: z.optional(z.string()),
	accountNo: z.optional(z.string()),
	phone: z.optional(z.string()),
	type: z.enum([RequestTypes.BANK, RequestTypes.MOBILE_MONEY]),
})
