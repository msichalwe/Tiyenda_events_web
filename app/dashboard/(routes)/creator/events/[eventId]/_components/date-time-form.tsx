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
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import { CalendarIcon, Pencil } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Event } from '@prisma/client'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import DateTimePicker from 'react-datetime-picker'
import {RotatingLines} from "react-loader-spinner";

export const revalidate = 0

const formSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
})

interface DateTimeFormProps {
	initialData: Event
	eventId: string
}

const DateTimeForm: React.FC<DateTimeFormProps> = ({
	initialData,
	eventId,
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const [dateType, setDateType] = useState('single')

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			startDate: initialData?.startDate || new Date(),
			endDate: initialData?.endDate || new Date(),
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
		<>
			<div className="mt-6 border bg-slate-100 rounded-md p-4">
				<div className="font-medium flex items-center justify-between">
					Event Date & Time
					<Button onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Date & Time
							</>
						)}
					</Button>
				</div>
				{!isEditing && (
					<>
						<p
							className={cn(
								'text-sm mt-2',
								!initialData.startDate && 'text-slate-500 italic',
							)}>
							{initialData.startDate
								? `${format(initialData.startDate, 'eee, do MMMM, y')}`
								: 'No Date'}
						</p>
						<div>
							{initialData.startDate && initialData.endTime && (
								<p className="text-sm mt-2">
									{format(initialData.startDate, 'hh:mm a')} -{' '}
									{format(initialData.endTime, 'hh:mm a')}
								</p>
							)}
						</div>
					</>
				)}

				{isEditing && (
					<>
						<Form {...form}>
							<form
								className="mt-4 space-y-4"
								onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Start Date & Time</FormLabel>
											<FormControl>
												<DateTimePicker
													value={field.value} // Set initial value
													onChange={(newValue) => field.onChange(newValue)} // Handle changes
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>End Date & Time</FormLabel>
											<FormControl>
												<DateTimePicker
													value={field.value}
													onChange={(newValue) => field.onChange(newValue)}
												/>
											</FormControl>
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
					</>
				)}
			</div>
		</>
	)
}

export default DateTimeForm
