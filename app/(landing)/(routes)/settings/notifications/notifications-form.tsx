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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { NotificationSchema } from '@/schemas'
import { Notifications } from '@prisma/client'
import { useTransition } from 'react'
import { notifications } from '@/actions/notifications'

type NotificationsFormValues = z.infer<typeof NotificationSchema>

type NotificationProps = {
	data: Notifications
}

export function NotificationsForm({ data }: NotificationProps) {
	const [isPending, startTransition] = useTransition()

	const defaultValues: Partial<NotificationsFormValues> = {
		communication_mail: data?.communication_mail || false,
		security_mail: data?.security_mail || true,
		marketing_mail: data?.marketing_mail || false,
		notify_me: data?.notify_me || 'none',
	}

	const form = useForm<NotificationsFormValues>({
		resolver: zodResolver(NotificationSchema),
		defaultValues,
	})

	function onSubmit(data: NotificationsFormValues) {
		startTransition(() => {
			notifications({
				notify_me: data.notify_me,
				security_mail: data.security_mail,
				communication_mail: data.communication_mail,
				marketing_mail: data.marketing_mail,
			})
				.then((data) => {
					if (data.error) {
						toast.error(`${data.error}`)
					}

					if (data.success) {
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
					name="notify_me"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Notify me about...</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex flex-col space-y-1">
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="all" />
										</FormControl>
										<FormLabel className="font-normal">
											All new events
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="favorite" />
										</FormControl>
										<FormLabel className="font-normal">
											My favorite events
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="none" />
										</FormControl>
										<FormLabel className="font-normal">Nothing</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="communication_mail"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Communication emails
										</FormLabel>
										<FormDescription>
											Receive emails about your account activity.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="marketing_mail"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Marketing emails
										</FormLabel>
										<FormDescription>
											Receive emails about new events, featured events, and
											more.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="security_mail"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Security emails</FormLabel>
										<FormDescription>
											Receive emails about your account activity and security.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button disabled={isPending} type="submit">
					Update notifications
				</Button>
			</form>
		</Form>
	)
}
