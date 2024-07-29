'use client'
import { Button } from '@/components/ui/button'
import { Event } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {RotatingLines} from "react-loader-spinner";

interface RefundPolicyFormProps {
	eventId: string
	initialData: Event
}

const formSchema = z.object({
	isRefundPolicy: z.boolean(),
	refundPolicy: z.optional(z.string()),
})

const RefundPolicyForm: React.FC<RefundPolicyFormProps> = ({
	eventId,
	initialData,
}) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isRefundPolicy: initialData.isRefundPolicy,
			refundPolicy: initialData.refundPolicy!,
		},
	})

	const { isSubmitting, isValid } = form.formState
	const onRefund = async () => {
		try {
			await axios.patch(`/api/events/${eventId}`, {
				isPublished: !initialData.isPublished,
			})
			toast.success('Event updated')
		} catch (error) {
			toast.error('Oops.. Something went wrong')
		}
	}
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Refund Policy
				<Button onClick={toggleEdit} variant={'ghost'}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Refund Policy
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div className="mt-2">
					{initialData.isRefundPolicy ? (
						<p className="text-sm text-slate-400">{initialData.refundPolicy}</p>
					) : (
						<p className="text-sm text-slate-400">Refund Policy is disabled</p>
					)}
				</div>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onRefund)}
						className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="isRefundPolicy"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Refund Policy</FormLabel>
										<FormDescription>Enable refund policy</FormDescription>
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
						{form.watch('isRefundPolicy') && (
							<FormField
								control={form.control}
								name="refundPolicy"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder="e.g. 'This is a refund of the event'"
												disabled={isSubmitting}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<div className="flex items-center gap-x-2">
							<Button type="submit" disabled={!isValid || isSubmitting}>
								{
									isSubmitting ? <RotatingLines
										visible={true}
										width="30"
										strokeColor={'white'}
										strokeWidth="5"
										animationDuration="0.75"
										ariaLabel="rotating-lines-loading"
									/> : 'Save'
								}
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	)
}

export default RefundPolicyForm
