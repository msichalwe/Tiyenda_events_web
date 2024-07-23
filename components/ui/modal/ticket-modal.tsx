'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useSession } from 'next-auth/react'
import { Modal } from './modal'
import { useTicketModal } from '@/hooks/use-ticket-modal'
import { useEffect, useState } from 'react'
import { Ticket } from '@prisma/client'
import { Ticket as TicketIcon } from 'lucide-react'
import { Input } from '../input'
import { Button } from '../button'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface TicketModalProps {
	isOpen: boolean
}

const formSchema = z.object({
	ticketLimit: z.string(),
})

const TicketModal: React.FC<TicketModalProps> = ({ isOpen }) => {
	const ticketModal = useTicketModal()

	const params = useParams()
	const router = useRouter()

	const [isMounted, setIsMounted] = useState(false)
	const [selected, setSelected] = useState('')

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			ticketLimit: '0',
		},
	})

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.post('/api/tickets', {
				ticketLimit: values.ticketLimit,
				eventId: params.eventId,
			})

			router.push(
				`/dashboard/creator/events/${params.eventId}/tickets/${response.data.id}`,
			)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Modal
			title="How many tickets do you want to sell?"
			description="You told us you want to sell this amount earlier. Choose how many tickets you'd like to sell for your event"
			isOpen={ticketModal.isOpenTicket}
			onClose={ticketModal.onCloseTicket}>
			<div className="min-h-[60vh] w-full">
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="grid grid-cols-2 gap-5">
							{ticketBoxes.map((ticketBox) => (
								<FormField
									control={form.control}
									name="ticketLimit"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div
													onClick={() => {
														setSelected(ticketBox.value)
														field.onChange(ticketBox.value)
													}}
													className={`${
														selected === ticketBox.value
															? 'border-blue-500 bg-gray-50'
															: ' border-gray-300'
													} px-4 py-2 rounded-xl min-h-[20vh] cursor-pointer border flex items-center flex-col space-y-x justify-center`}>
													<TicketIcon className="rounded-full bg-blue-100 text-blue-500 p-5 h-16 w-16" />
													<p>{ticketBox.description}</p>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							))}
						</div>
						<div className="max-w-lg space-y-2 mt-5">
							<p>Or set a specific event capacity</p>
							<FormField
								control={form.control}
								name="ticketLimit"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input disabled={isSubmitting} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full flex items-center justify-end mt-2">
							<Button disabled={!isValid || isSubmitting}>Continue</Button>
						</div>
					</form>
				</Form>
			</div>
		</Modal>
	)
}

export default TicketModal

const ticketBoxes = [
	{
		id: 1,
		description: 'Up to 25 Tickets',
		value: '25',
	},
	{
		id: 2,
		description: 'Up to 100 Tickets',
		value: '100',
	},
	{
		id: 3,
		description: 'Up to 250 Tickets',
		value: '250',
	},
	{
		id: 3,
		description: 'Up to 500 Tickets',
		value: '500',
	},
]
