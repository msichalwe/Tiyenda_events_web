'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { settings } from '@/actions/settings-admin'
import { useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { SettingsSchema } from '@/schemas'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Account, User, UserRole } from '@prisma/client'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

type AccountFormValues = z.infer<typeof SettingsSchema>

interface UserProps {
	user: User
}

export function AccountForm({ user }: UserProps) {
	const { update } = useSession()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const defaultValues: Partial<AccountFormValues> = {
		id: user?.id,
		name: user?.name || '',
		email: user?.email || '',
		password: undefined,
		newPassword: undefined,
		role: user?.role,
		isTwoFactorEnabled: user?.isTwoFactorEnabled,
	}

	const form = useForm<AccountFormValues>({
		resolver: zodResolver(SettingsSchema),
		defaultValues,
	})

	function onSubmit(data: AccountFormValues) {
		startTransition(() => {
			settings({
				name: data.name,
				email: data.email,
				id: data.id,
				role: data.role,
				isTwoFactorEnabled: data.isTwoFactorEnabled,
			})
				.then((data) => {
					if (data.error) {
						toast.error(`${data.error}`)
					}

					if (data.success) {
						update()
						router.refresh()
						toast.success(`${data.success}`)
					}
				})
				.catch(() => toast.error('Oops.. Something went wrong'))
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Your name" {...field} />
							</FormControl>
							<FormDescription>
								This is the name that will be displayed on their profile and in
								emails.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Your Email" {...field} />
								</FormControl>
								<FormDescription>
									Your email address used to send notifications and sign in
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="*******" {...field} />
								</FormControl>
								<FormDescription>Your current password.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="*******" {...field} />
								</FormControl>
								<FormDescription>
									The new password you want to change to
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select
								disabled={isPending}
								onValueChange={field.onChange}
								defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
									<SelectItem value={UserRole.USER}>User</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isTwoFactorEnabled"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">
									Two-Factor Authentication
								</FormLabel>
								<FormDescription>
									Enable 2FA authentication on sign in
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									aria-readonly
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button disabled={isPending} type="submit">
					Update account
				</Button>
			</form>
		</Form>
	)
}
