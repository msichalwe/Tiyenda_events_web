'use client'

import { Button } from '@/components/ui/button'
import { fetcher } from '@/lib/fetcher'
import { Organizer } from '@prisma/client'
import axios from 'axios'
import { addDays } from 'date-fns'
import { CheckCircle, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

const AcceptInvitation = ({
	organizerId,
	data,
}: {
	organizerId: string
	data: any
}) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const { data: organizer, isLoading } = useSWR<Organizer>(
		`/api/organizer/${organizerId}`,
		fetcher,
	)

	if (isLoading) {
		return <Loader2 className="animate-spin" />
	}

	const expiryDate = data?.createdAt
		? addDays(new Date(data.createdAt), 7).toDateString()
		: '' // Calculate expiry date if

	const onUpdate = async () => {
		try {
			setLoading(true)
			await axios.patch(`/api/invitation/accept/${data.id}`)
			toast('Accepted Invite', {
				description: 'Invitation has been accepted',
				icon: <CheckCircle />,
			})
			router.push('/dashboard/creator/organizers')
		} catch (error) {
			toast('Error', {
				description: 'Oops... Something went wrong',
				icon: <X />,
			})
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="flex items-center flex-col space-y-4">
			<Image
				src={organizer?.imageUrl!}
				alt={organizer?.name!}
				width={100}
				height={100}
			/>
			<h1 className="text-2xl uppercase font-bold">
				Accept Invitation to <span className="">{organizer?.name}</span>
			</h1>
			<p className="font-medium text-lg">
				Invitation Expires on <span className="italic">"{expiryDate}"</span>
			</p>
			<Button onClick={onUpdate} disabled={loading} variant={'success'}>
				{loading ? (
					<span className="flex gap-2">
						<Loader2 className="text-white h-4 w-4 animate-spin" />
						accepting..
					</span>
				) : (
					'Accept Invitation'
				)}
			</Button>
		</div>
	)
}

export default AcceptInvitation
