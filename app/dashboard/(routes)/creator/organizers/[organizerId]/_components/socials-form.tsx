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
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Organizer } from '@prisma/client'

export const revalidate = 0

type SocialsFormProps = {
	initialData: Organizer
	organizerId: string
}

const formSchema = z.object({
	facebook: z.string().optional(),
	instagram: z.string().optional(),
	x: z.string().optional(),
})

const SocialsForm: React.FC<SocialsFormProps> = ({
	initialData,
	organizerId,
}) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			facebook: initialData?.facebook || '',
			instagram: initialData?.instagram || '',
			x: initialData?.x || '',
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
				Organizer Socials
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
				<div>
					<div className="flex gap-2">
						<p className="text-sm">Facebook:</p>
						<p className="text-sm">{initialData.facebook}</p>
					</div>
					<div className="flex gap-2 mt-2">
						<p className="text-sm">Instagram:</p>
						<p className="text-sm">{initialData.instagram}</p>
					</div>
					<div className="flex gap-2 mt-2">
						<p className="text-sm">X:</p>
						<p className="text-sm">{initialData.x}</p>
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
							name="facebook"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder='e.g. "https://facebook.com/your-organizer"'
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="instagram"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder='e.g. "https://instagram.com/your-organizer"'
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="x"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder='e.g. "https://x.com/your-organizer"'
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
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	)
}

export default SocialsForm
