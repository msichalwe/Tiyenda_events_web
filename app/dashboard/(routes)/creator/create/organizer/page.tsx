'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
})
const CreatePage = () => {
	const router = useRouter()
	const session = useSession()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.post('/api/organizer', {
				...values,
			})
			router.push(`/dashboard/creator/organizers/${response.data.id}`)
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className="mx-w-5xl mx-auto flex md:items-center md:justify-center h-[80vh] p-6">
			<div>
				<h1 className="text-2xl font-medium">Name your Organizer</h1>
				<p className="text-sm text-slate-600">
					What would you like to name your Organizer? Don&apos;t worry, you can
					change this later.
				</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 mt-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Orangizer Name</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting} {...field} />
									</FormControl>
									<FormDescription>
										What is the name of your organizer?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Link href={'/dashboard/creator/organizers'}>
								<Button variant={'ghost'} type="button">
									Cancel
								</Button>
							</Link>
							<Button type="submit" disabled={!isValid || isSubmitting}>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default CreatePage
