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
import { ResetSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '../form-success'
import { reset } from '@/actions/reset'
import { useState, useTransition } from 'react'

export const ResetForm = () => {
	const [isPending, startTransition] = useTransition()

	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	})

	const { isValid } = form.formState

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		startTransition(() => {
			reset(values).then((data) => {
				setError(data?.error)
				setSuccess(data?.success)
			})
		})
	}

	return (
		<CardWrapper
			headerLabel="Forgot your password"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login">
			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="space-y-4">
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
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						disabled={isPending || !isValid}
						type="submit"
						className="w-full">
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
