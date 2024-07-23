'use client'
import { Button } from '@/components/ui/button'
import { Event } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const revalidate = 0

interface PublishToggleProps {
	eventId: string
	initialData: Event
}

const PublishToggle: React.FC<PublishToggleProps> = ({
	eventId,
	initialData,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()

	const toastTitle = initialData.isPublished
		? 'Event Unpublished'
		: 'Event Published'

	const onPublish = async () => {
		try {
			setIsSubmitting(true)
			await axios.patch(`/api/events/${eventId}`, {
				isPublished: !initialData.isPublished,
			})
			toast.success(toastTitle)
			router.push('/dashboard/creator/events')
		} catch (error) {
			toast.error('Oops.. Something went wrong')
		} finally {
			setIsSubmitting(false)
		}
	}
	return (
		<div>
			<Button onClick={onPublish} disabled={isSubmitting}>
				{initialData.isPublished ? 'Unpublish' : 'Publish'}
			</Button>
		</div>
	)
}

export default PublishToggle
