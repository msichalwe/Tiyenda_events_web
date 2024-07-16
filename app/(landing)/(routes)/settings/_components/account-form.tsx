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
import { settings } from '@/actions/settings-public'
import { useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { PublicSettingsSchema } from '@/schemas'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Account, User, UserRole } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { PhoneInput } from '@/components/ui/phone-input'
import CountryDropdown from '@/components/ui/countries'
import { useStore } from 'zustand'
import { useDropdownStore } from '@/lib/store/dropdown'

type AccountFormValues = z.infer<typeof PublicSettingsSchema>

interface UserProps {
	user: User
}

export function AccountForm({ user }: UserProps) {
	const { update } = useSession()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const { countryValue, setCountryValue } = useDropdownStore()

	useEffect(() => {
		if (user.country) {
			setCountryValue(user.country)
		}
	}, [])

	const defaultValues: Partial<AccountFormValues> = {
		id: user?.id,
		name: user?.name || '',
		email: user?.email || '',
		password: undefined,
		newPassword: undefined,
		phoneNumber: user?.phoneNumber || '',
		isTwoFactorEnabled: user?.isTwoFactorEnabled,
		city: user?.city || '',
		address: user?.address || '',
	}

	const form = useForm<AccountFormValues>({
		resolver: zodResolver(PublicSettingsSchema),
		defaultValues,
	})

	function onSubmit(data: AccountFormValues) {
		startTransition(() => {
			settings({
				name: data.name,
				email: data.email,
				id: data.id,
				phoneNumber: data.phoneNumber,
				city: data.city,
				country: countryValue,
				address: data.address,
				isTwoFactorEnabled: data.isTwoFactorEnabled,
				password: data.password,
				newPassword: data.newPassword,
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
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<PhoneInput placeholder="Enter a phone number" {...field} />
								</FormControl>

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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="country"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Country</FormLabel>
								<FormControl>
									<CountryDropdown {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

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
				<div></div>

				<Button disabled={isPending} type="submit">
					Update account
				</Button>
			</form>
		</Form>
	)
}
