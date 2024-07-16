'use client'
import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Event, Gallery } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'

export const revalidate = 0

const formSchema = z.object({
	url: z.string().min(1, 'Image is required'),
})

interface ImageFormProps {
	initialData: Event & {
		gallery: Gallery[]
	}
	eventId: string
}

const AttachmentsForm: React.FC<ImageFormProps> = ({
	initialData,
	eventId,
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/events/${eventId}/attachments`, values)
			toast.success('Event updated')
			toggleEdit()
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id)
			await axios.delete(`/api/events/${eventId}/attachments/${id}`)
			toast.success('Attachment deleted')
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			setDeletingId(null)
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Event Gallery
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add attachment
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<>
					{initialData.gallery.length === 0 && (
						<p className="text-sm mt-2 text-slate-500 italic">
							No Event gallery attachments yet
						</p>
					)}

					{initialData.gallery.length > 0 && (
						<div>
							{initialData.gallery.map((attachment) => (
								<div
									key={attachment.id}
									className="flex items-center p-3 w-full bg-orange-100 border border-orange-200 rounded-md text-orange-700">
									<File className="h-4 w-4 mr-2 flex-shrink-0" />
									<p className="text-xs line-clamp-1">{attachment.name}</p>
									{deletingId === attachment.id && (
										<div>
											<Loader2 className="h-4 w-4 anime-spin" />
										</div>
									)}
									{deletingId !== attachment.id && (
										<button
											onClick={() => onDelete(attachment.id)}
											className="ml-auto hover:opacity-75 transition">
											<X className="h-4 w-4 " />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}

			{isEditing && (
				<div>
					<FileUpload
						endpoint="eventAttachment"
						onChange={(url) => {
							if (url) {
								onSubmit({ url: url })
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Add an attachment to your event
					</div>
				</div>
			)}
		</div>
	)
}

export default AttachmentsForm
