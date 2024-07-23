'use client'
import { Button } from '@/components/ui/button'
import { Event } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

	const [isSubmitting, setIsSubmitting] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isRefundPolicy: initialData.isRefundPolicy,
			refundPolicy: initialData.refundPolicy!,
		},
	})

	const onRefund = async () => {
		try {
			setIsSubmitting(true)
			await axios.patch(`/api/events/${eventId}`, {
				isPublished: !initialData.isPublished,
			})
			router.push('/dashboard/creator/events')
		} catch (error) {
			toast.error('Oops.. Something went wrong')
		} finally {
			setIsSubmitting(false)
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
						className="mt-4 space-y-4"></form>
				</Form>
			)}
		</div>
	)
}

export default RefundPolicyForm
