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
import { Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Event, Ticket } from '@prisma/client'

export const revalidate = 0

const formSchema = z.object({
	ticketLimit: z.string(),
})

interface TicketFormProps {
	initialData: Event
	eventId: string
}

const TicketForm: React.FC<TicketFormProps> = ({ initialData, eventId }) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			ticketLimit: initialData.ticketLimit?.toString() || '0',
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/events/${eventId}`, {
				ticketLimit: parseInt(values.ticketLimit),
			})
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
				Event Tickets
				{!initialData.isPublished && (
					<Button onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Ticket
							</>
						)}
					</Button>
				)}
			</div>
			{!isEditing && (
				<div>
					<ul>
						{/* @ts-ignore */}
						{initialData.Ticket.map((ticket: Ticket) => (
							<li>{ticket.name}</li>
						))}
					</ul>
				</div>
			)}

			{isEditing && (
				<>
					<Button
						className="mt-4"
						onClick={() =>
							router.push(`/dashboard/creator/events/${eventId}/tickets`)
						}>
						<PlusCircle /> Add Ticket
					</Button>
				</>
			)}
		</div>
	)
}

export default TicketForm
