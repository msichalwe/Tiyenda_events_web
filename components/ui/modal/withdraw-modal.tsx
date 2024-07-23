import React from 'react'
import { Modal } from './modal'
import { useWithdrawalModal } from '@/hooks/use-withdrawal-modal'
import * as z from 'zod'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { WithdrawalSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { RequestTypes } from '@prisma/client'
import { Button } from '../button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const WithdrawModal = () => {
	const withdrawModal = useWithdrawalModal()

	const user = useCurrentUser()
	const router = useRouter()

	const form = useForm<z.infer<typeof WithdrawalSchema>>({
		resolver: zodResolver(WithdrawalSchema),
		defaultValues: {
			type: RequestTypes.MOBILE_MONEY,
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof WithdrawalSchema>) => {
		try {
			const response = await axios.post('/api/request-withdrawal', {
				...values,
				organizerId: user?.organizerId,
			})

			toast.success('Withdrawal request sent')
			router.refresh()
			withdrawModal.onCloseWithdrawal()
		} catch (error) {
			console.log(error)
			toast.error('Oops! something went wrong')
		}
	}

	return (
		<Modal
			title={`Request a Withdrawal`}
			description="Enter the amount you want to withdraw and your payment details."
			isOpen={withdrawModal.isOpenWithdrawal}
			onClose={withdrawModal.onCloseWithdrawal}>
			<Form {...form}>
				<form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount to withdraw</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										{...field}
										type="number"
										placeholder="Amount"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Payment Method</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a method" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value={RequestTypes.MOBILE_MONEY}>
											Mobile Money
										</SelectItem>
										<SelectItem value={RequestTypes.BANK}>Bank</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					{form.watch('type') === RequestTypes.BANK && (
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="bankName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bank Name</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												{...field}
												type="text"
												placeholder="Bank Name"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="accountName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name on Account</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												{...field}
												type="text"
												placeholder="Name on Account"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="accountNo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account Number</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												{...field}
												type="text"
												placeholder="Account Number"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					{form.watch('type') === RequestTypes.MOBILE_MONEY && (
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											{...field}
											type="text"
											placeholder="Phone Number"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<Button type="submit" disabled={!isValid || isSubmitting}>
						Submit
					</Button>
				</form>
			</Form>
		</Modal>
	)
}

export default WithdrawModal
