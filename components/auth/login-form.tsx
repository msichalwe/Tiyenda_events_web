'use client'

import * as z from 'zod'
import { CardWrapper } from './card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormLabel,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { LoginSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { login } from '@/actions/login'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const LoginForm = () => {
	const [isPending, startTransition] = useTransition()
	const searchParams = useSearchParams()

	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with a different provider'
			: ''
	const [showTwoFactor, setShowTwoFactor] = useState(false)
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const { isValid } = form.formState

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		startTransition(() => {
			login(values)
				.then((data) => {
					if (data?.error) {
						form.reset()
						setError(data?.error)
					}
					if (data?.success) {
						form.reset()
						setSuccess(data?.success)
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true)
					}
				})
				.catch(() => setError('Oops.. Something went wrong.'))
		})
	}

	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonHref="/auth/register"
			backButtonLabel="Don't have an account?"
			showSocial>
			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="space-y-4">
						{showTwoFactor && (
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												{...field}
												placeholder="Enter code..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{!showTwoFactor && (
							<>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													disabled={isPending}
													{...field}
													placeholder="john.doe@example.com"
													type="email"
												/>
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
												<Input
													disabled={isPending}
													{...field}
													placeholder="********"
													type="password"
												/>
											</FormControl>
											<Button
												size="sm"
												variant={'link'}
												asChild
												className="px-0 font-normal">
												<Link href="/auth/reset">Forgot Password?</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button
						disabled={isPending || !isValid}
						type="submit"
						className="w-full">
						{showTwoFactor ? 'Confirm' : 'Login'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
