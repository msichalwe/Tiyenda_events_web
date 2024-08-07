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
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/file-upload'

const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	imageUrl: z.string().min(1, 'Image is required'),
})

const CategoryForm = () => {
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/categories`, values)
			toast.success('Category Created')
			form.reset({
				name: '',
				description: '',
				imageUrl: '',
			})
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Category Details
			</div>

			<Form {...form}>
				<form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input disabled={isSubmitting} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea disabled={isSubmitting} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image URL</FormLabel>
								<FormControl>
									<FileUpload
										endpoint="eventImage"
										onChange={(url) => {
											if (url) {
												form.setValue('imageUrl', url)
											}
										}}
									/>
								</FormControl>
								<FormDescription>
									{form.watch('imageUrl') && 'Image uploaded successfully'}
								</FormDescription>
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
		</div>
	)
}

export default CategoryForm
