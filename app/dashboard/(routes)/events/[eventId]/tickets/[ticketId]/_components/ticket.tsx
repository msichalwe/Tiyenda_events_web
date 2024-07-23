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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { IconBadge } from '@/components/icon-badge'
import {
	CalendarIcon,
	ChevronRight,
	DollarSign,
	HeartIcon,
	Loader2,
	TicketIcon,
	User,
} from 'lucide-react'
import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { MobileTimePicker, TimePicker } from '@mui/x-date-pickers'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Ticket as TicketType } from '@prisma/client'

type TicketProps = {
	ticket: TicketType
}

const formSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
	ticketLimit: z.string().min(1, 'Tickets must be at least 1'),
	price: z.string().optional(),
	startDate: z.date(),
	endDate: z.date(),
	description: z.string().optional(),
	minQuantity: z.string().optional(),
	maxQuantity: z.string().optional(),
	type: z.string(),
})

const Ticket: React.FC<TicketProps> = ({ ticket }) => {
	const [types, setTypes] = useState('')

	const params = useParams()

	const defaultValues = {
		name: ticket?.name ? ticket.name : '',
		ticketLimit: ticket?.ticketLimit || '',
		price: ticket?.price || '',
		startDate: ticket?.startDate || new Date(),
		endDate: ticket?.endDate || new Date(),
		description: ticket?.description || '',
		type: ticket?.type || types,
	}
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	const router = useRouter()

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/tickets/ticket/${params.ticketId}`, {
				...values,
				maxQuantity: values.maxQuantity ? values.maxQuantity : null,
				minQuantity: values.minQuantity ? values.minQuantity : null,
				price: values.price ? values.price : null,
				ticketLimit: values.ticketLimit,
			})
			toast({
				title: 'Success',
				description: 'Ticket created successfully.',
			})
			router.push(`/dashboard/creator/events/${params.eventId}`)
		} catch (error) {
			console.log(error)
			toast({
				title: 'Error',
				description: 'Oops! Something went wrong. Please try again.',
				variant: 'destructive',
			})
		}
	}
	return (
		<div className="w-5/6 mx-auto p-6 h-screen">
			<Sheet>
				<div className="space-y-2">
					<h1 className="text-4xl font-bold"> Create tickets</h1>
					<p>Choose a ticket type</p>
				</div>
				<div className=" grid grid-cols-4 gap-10 mt-10">
					<div className="col-span-3 space-y-4 w-full">
						<SheetTrigger className="w-full">
							<div
								onClick={() => form.setValue('type', 'paid')}
								className="flex items-center text-left justify-between border border-gray-100 p-6 rounded-lg">
								<div className="flex justify-between items-center">
									<div className="w-[100px] h-[100px] flex items-center justify-center bg-blue-50 rounded-xl">
										<DollarSign className="text-blue-500 h-14 w-14" />
									</div>
									<div className="space-y-2 ml-10">
										<p className="font-medium text-2xl">Paid</p>
										<p>Create a ticket that people have to pay for.</p>
									</div>
								</div>
								<div>
									<ChevronRight className="" />
								</div>
							</div>
						</SheetTrigger>
						<SheetTrigger className="w-full">
							<div
								onClick={() => form.setValue('type', 'free')}
								className="flex items-center text-left justify-between border border-gray-100 p-6 rounded-lg">
								<div className="flex justify-between items-center">
									<div className="w-[100px] h-[100px] flex items-center justify-center bg-purple-50 rounded-xl">
										<TicketIcon className="text-purple-500 h-14 w-14" />
									</div>
									<div className="space-y-2 ml-10">
										<p className="font-medium text-2xl">Free</p>
										<p>Create a ticket that no one has to pay for.</p>
									</div>
								</div>
								<div>
									<ChevronRight className="" />
								</div>
							</div>
						</SheetTrigger>
						<SheetTrigger className="w-full">
							<div
								onClick={() => form.setValue('type', 'donation')}
								className="flex items-center text-left justify-between border border-gray-100 p-6 rounded-lg">
								<div className="flex justify-between items-center">
									<div className="w-[100px] h-[100px] flex items-center justify-center bg-red-50 rounded-xl">
										<HeartIcon className="text-red-500 h-14 w-14" />
									</div>
									<div className="space-y-2 ml-10">
										<p className="font-medium text-2xl">Donation</p>
										<p>Let People pay any amount for their ticket.</p>
									</div>
								</div>
								<div>
									<ChevronRight className="" />
								</div>
							</div>
						</SheetTrigger>
					</div>
					<div className="py-6 px-4 bg-blue-50 rounded-xl h-[20vh] flex justify-between p-4 ">
						<div className="flex items-start  flex-col justify-evenly">
							<IconBadge icon={User} />
							<p className="text-lg font-medium">Ticket Capacity</p>
							<p>Up to tickets {ticket?.ticketLimit} </p>
						</div>
						<div>
							<p className="text-blue-500">Edit</p>
						</div>
					</div>
				</div>

				<SheetContent className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Add tickets</SheetTitle>
					</SheetHeader>
					<Form {...form}>
						<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								name="type"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="grid grid-cols-3 gap-3 mt-5">
												<button
													type="button"
													onClick={() => field.onChange('paid')}
													className={`py-2 px-4 rounded border  ${
														form.watch('type') === 'paid'
															? 'bg-blue-100 text-blue-500 border-blue-600'
															: 'border-gray-500 text-gray-500 hover:bg-gray-50'
													} `}>
													Paid
												</button>
												<button
													type="button"
													onClick={() => field.onChange('free')}
													className={`py-2 px-4 rounded border  ${
														form.watch('type') === 'free'
															? 'bg-blue-100 text-blue-500 border-blue-600'
															: 'border-gray-500 text-gray-500 hover:bg-gray-50'
													} `}>
													Free
												</button>
												<button
													type="button"
													onClick={() => field.onChange('donation')}
													className={`py-2 px-4 rounded border  ${
														form.watch('type') === 'donation'
															? 'bg-blue-100 text-blue-500 border-blue-600'
															: 'border-gray-500 text-gray-500 hover:bg-gray-50'
													} `}>
													Donation
												</button>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												{...field}
												placeholder="General Admission"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="ticketLimit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Avaliable quantity <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input disabled {...field} placeholder="100" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{form.watch('type') === 'paid' && (
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Price <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													disabled={isSubmitting}
													{...field}
													placeholder="ZMW100.00"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Sales start</FormLabel>
											<FormControl>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={'outline'}
																className={cn(
																	'w-full pl-3 text-left font-normal',
																	!field.value && 'text-muted-foreground',
																)}>
																{field.value ? (
																	format(field.value, 'PPP')
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent>
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date: any) => date < new Date()}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Sales end</FormLabel>
											<FormControl>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={'outline'}
																className={cn(
																	'w-full pl-3 text-left font-normal',
																	!field.value && 'text-muted-foreground',
																)}>
																{field.value ? (
																	format(field.value, 'PPP')
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent>
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date: any) => date < new Date()}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="space-y-2">
								<p>Advanced settings</p>
								<ScrollArea className="w-full h-full pb-2 space-y-2">
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														disabled={isSubmitting}
														{...field}
														placeholder="Tell attendees more about this ticket"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="mt-5">
										<FormLabel>Tickets per order</FormLabel>
										<div className="flex items-center gap-x-2 mt-2">
											<FormField
												control={form.control}
												name="minQuantity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Min Quantity</FormLabel>
														<FormControl>
															<Input
																disabled={isSubmitting}
																{...field}
																placeholder="1"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="maxQuantity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Max Quantity</FormLabel>
														<FormControl>
															<Input
																disabled={isSubmitting}
																{...field}
																placeholder="10"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</ScrollArea>
							</div>

							<SheetFooter>
								<Button>Save</Button>
							</SheetFooter>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default Ticket
