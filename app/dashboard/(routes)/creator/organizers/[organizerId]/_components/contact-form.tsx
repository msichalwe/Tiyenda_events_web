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
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const revalidate = 0

const formSchema = z.object({
	contactEmail: z.string().min(1, 'Email is equired'),
	contactPhone: z.string().min(1, 'Phone is required'),
})

interface ContactFormProps {
	initialData: {
		contactEmail: string | null
		contactPhone: string | null
	}
	organizerId: string
}

const ContactForm: React.FC<ContactFormProps> = ({
	initialData,
	organizerId,
}) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			contactEmail: initialData.contactEmail!,
			contactPhone: initialData.contactPhone!,
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/organizer/${organizerId}`, values)
			toast.success('Organizer updated')
			toggleEdit()
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Contact Information
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Contact Info
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div>
					<div className="flex gap-2">
						<p className="text-sm">Email:</p>
						<p className="text-sm">{initialData.contactEmail}</p>
					</div>
					<div className="flex gap-2 mt-2">
						<p className="text-sm">Phone:</p>
						<p className="text-sm">{initialData.contactPhone}</p>
					</div>
				</div>
			)}

			{isEditing && (
				<Form {...form}>
					<form
						className="mt-4 space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="contactPhone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="contactEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting} {...field} />
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

export default ContactForm
