'use client'
import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Event } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'

export const revalidate = 0

const formSchema = z.object({
	image: z.string().min(1, 'Image is required'),
})

interface ImageFormProps {
	initialData: Event
	eventId: string
}

const ImageForm: React.FC<ImageFormProps> = ({ initialData, eventId }) => {
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	const toggleEdit = () => setIsEditing((current) => !current)

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
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Event Image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData?.image && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add Image
						</>
					)}
					{!isEditing && initialData?.image && (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Image
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData.image ? (
					<>
						<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md ">
							<ImageIcon className="h-10 w-10 text-slate-500" />
						</div>
					</>
				) : (
					<div className="relative aspect-video mt-2">
						<Image
							fill
							alt="upload"
							className="object-cover rounded-md"
							src={initialData.image}
						/>
					</div>
				))}

			{isEditing && (
				<div>
					<FileUpload
						endpoint="eventImage"
						onChange={(url) => {
							if (url) {
								onSubmit({ image: url })
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
				</div>
			)}
		</div>
	)
}

export default ImageForm
