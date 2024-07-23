'use client'

import * as React from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
})

type FormValues = z.infer<typeof formSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const session = useSession()
	const router = useRouter()
	useEffect(() => {
		if (session?.status === 'authenticated') {
			router.push(`/`)
		}
	}, [session?.status])

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			setIsLoading(true)
			signIn('email', {
				...data,
				redirect: false,
			}).then((callback) => {
				if (callback?.error) {
					toast.error('Something went wrong')
				}
				if (callback?.ok && !callback?.error) {
					toast.success('Check your email for a confirmation link')
				}
			})
		} catch (error) {
		} finally {
			setIsLoading(false)
		}
	}

	const socialAction = (action: string) => {
		setIsLoading(true)
		signIn(action, {
			redirect: false,
		})
			.then((callback) => {
				if (callback?.error) {
					toast.error('Something went wrong!')
				}
				if (callback?.ok && !callback?.error) {
					toast.success('Logged in successfully')
				}
			})
			.catch((err) => console.log(err))
			.finally(() => setIsLoading(false))
	}

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<FormField
								name="email"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="Email Address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Sign In with Email
						</Button>
					</div>
				</form>
			</Form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Button
				onClick={() => socialAction('google')}
				variant="outline"
				type="button"
				disabled={isLoading}>
				{isLoading ? (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.google className="mr-2 h-4 w-4" />
				)}{' '}
				Google
			</Button>
			<Button
				onClick={() => socialAction('facebook')}
				variant="outline"
				type="button"
				disabled={isLoading}>
				{isLoading ? (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.facebook className="mr-2 h-4 w-4" />
				)}{' '}
				Facebook
			</Button>
		</div>
	)
}
