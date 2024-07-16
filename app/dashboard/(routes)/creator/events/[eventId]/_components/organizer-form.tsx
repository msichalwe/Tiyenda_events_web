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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Event } from '@prisma/client'
import { Combobox } from '@/components/ui/combobox'

export const revalidate = 0

const formSchema = z.object({
	organizerId: z.string().min(1, 'Organizer is required'),
})

interface organizerProps {
	initialData: Event
	eventId: string
	options: {
		label: string
		value: string
	}[]
}

const organizer: React.FC<organizerProps> = ({
	initialData,
	eventId,
	options,
}) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			organizerId: initialData?.organizerId || '',
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

	const selectedOption = options.find(
		(option) => option.value === initialData.organizerId,
	)

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Event Organizer
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Organizer
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.organizerId && 'text-slate-500 italic',
					)}>
					{selectedOption?.label || 'No Organizer'}
				</p>
			)}

			{isEditing && (
				<Form {...form}>
					<form
						className="mt-4 space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="organizerId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Combobox options={options} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button type="submit" disabled={!isValid || isSubmitting}>
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	)
}

export default organizer
