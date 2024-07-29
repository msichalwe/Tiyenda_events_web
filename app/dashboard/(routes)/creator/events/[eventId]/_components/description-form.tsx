'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Event } from '@prisma/client'
import {RotatingLines} from "react-loader-spinner";

const formSchema = z.object({
	description: z.string().min(1, 'Description is required'),
})

export const revalidate = 0

interface DescriptionFormProps {
	initialData: Event
	eventId: string
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({
	initialData,
	eventId,
}) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData?.description || '',
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/events/${eventId}`, values)
			toast.success('Event updated')
			toggleEdit()
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Event Description
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Description
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.description && 'text-slate-500 italic',
					)}>
					{initialData.description || 'No Description'}
				</p>
			)}

			{isEditing && (
				<Form {...form}>
					<form
						className="mt-4 space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="e.g. 'This is a description of the event'"
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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

export default DescriptionForm
