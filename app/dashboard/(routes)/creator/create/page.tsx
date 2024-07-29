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
import { redirect, useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useCurrentUser } from '@/hooks/use-current-user'
import {RotatingLines} from "react-loader-spinner";
import React from "react";

const formSchema = z.object({
	name: z.string().min(1, 'Title is required'),
})
const CreatePage = () => {
	const user = useCurrentUser()

	if (!user?.organizerId) {
		redirect('/dashboard/creator/create/organizer')
	}

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
			const response = await axios.post('/api/events', {
				...values,
				userId: session?.data?.user?.id,
			})
			router.push(`/dashboard/creator/events/${response.data.id}`)
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className="mx-w-5xl mx-auto flex md:items-center md:justify-center h-[80vh] p-6">
			<div>
				<h1 className="text-2xl font-medium">Name your Event</h1>
				<p className="text-sm text-slate-600">
					What would you like to name your event? Don&apos;t worry, you can
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
									<FormLabel>Event Name</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting} {...field} />
									</FormControl>
									<FormDescription>
										What is the name of your event?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Link href={'/dashboard/creator'}>
								<Button variant={'ghost'} type="button">
									Cancel
								</Button>
							</Link>
							<Button type="submit" disabled={!isValid || isSubmitting}>
								{
									isSubmitting ? <RotatingLines
										visible={true}
										width="30"
										strokeColor={'white'}
										strokeWidth="5"
										animationDuration="0.75"
										ariaLabel="rotating-lines-loading"
									/> : 'Continue'
								}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default CreatePage
