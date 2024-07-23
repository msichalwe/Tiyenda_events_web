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
import { RegisterSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '../form-success'
import { useState, useTransition } from 'react'
import { register } from '@/actions/register'

export const RegisterForm = () => {
	const [isPending, startTransition] = useTransition()

	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	})

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		startTransition(() => {
			register(values).then((data) => {
				setError(data.error)
				setSuccess(data.success)
			})
		})
	}

	return (
		<CardWrapper
			headerLabel="Create an account"
			backButtonHref="/auth/login"
			backButtonLabel="Already have an account?"
			showSocial>
			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full name</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											{...field}
											placeholder="John Doe"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button disabled={isPending} type="submit" className="w-full">
						Create an account
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
