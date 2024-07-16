'use client'

import useSWR from 'swr'
import { Modal } from './modal'
import { useAddMemberModal } from '@/hooks/user-add-member'
import { CheckCircle, Loader2, X } from 'lucide-react'
import { fetcher } from '@/lib/fetcher'
import { useState } from 'react'
import Search from '@/app/components/search'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import { ScrollArea } from '../scroll-area'
import { Button } from '../button'
import axios from 'axios'
import { toast } from 'sonner'

interface AddMemberProps {
	organizerId: string | string[]
	data: any
}

const AddMembarModal: React.FC<AddMemberProps> = ({ organizerId, data }) => {
	const addMemberModal = useAddMemberModal()
	const [loading, setLoading] = useState(false)
	const [selectedItem, setSelectedItem] = useState<any | null>(null)
	const { data: organizer, isLoading } = useSWR(
		`/api/organizer/${organizerId}`,
		fetcher,
	)

	if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />

	const onInvite = async () => {
		try {
			setLoading(true)
			await axios.post('/api/invitation', {
				userId: selectedItem.id,
				organizerId,
			})
			toast('Invitation has been sent', {
				description: `Invitation to ${selectedItem.name} has been sent `,
				icon: <CheckCircle />,
			})

			setSelectedItem(null)
		} catch (error) {
			toast('Error', {
				description: 'Something went wrong, try again',
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title={`Add a member to the organization ${organizer.name}`}
			description="Search of a user on ther platform to add to the organization"
			isOpen={addMemberModal.isAddMenuOpen}
			onClose={addMemberModal.onAddMenuClose}>
			{selectedItem === null ? (
				<>
					<Search />
					<ScrollArea className="h-72 rounded-md border  mt-2">
						{data.map((item: any) => (
							<div
								key={item.id}
								onClick={() => setSelectedItem(item)}
								className="flex items-center my-2 w-full hover:text-white cursor-pointer hover:bg-blue-500 p-2">
								<Avatar>
									<AvatarImage alt={item.name} src={item.image} />
									<AvatarFallback className="text-gray-900 font-medium">
										{item?.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="ml-2">
									<h3 className="text-sm">{item.name}</h3>
									<p className="text-xs text-gray-300">{item.email}</p>
								</div>
							</div>
						))}
					</ScrollArea>
				</>
			) : (
				<>
					<div className="flex items-center p-3 w-full bg-orange-100 border border-orange-200 rounded-md text-orange-700">
						<div className="flex items-center">
							<Avatar>
								<AvatarImage alt={selectedItem.name} src={selectedItem.image} />
								<AvatarFallback className="text-gray-900 font-medium">
									{selectedItem?.name?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="ml-2">
								<h3 className="text-sm">{selectedItem.name}</h3>
								<p className="text-xs text-blue-600">{selectedItem.email}</p>
							</div>
						</div>
						<button
							onClick={() => setSelectedItem(null)}
							className="ml-auto hover:opacity-75 transition">
							<X className="h-4 w-4 " />
						</button>
					</div>
					<Button
						onClick={onInvite}
						disabled={loading}
						className="w-full mt-4"
						variant={'success'}>
						{loading ? 'sending invite...' : 'Add to this organization'}
					</Button>
				</>
			)}
		</Modal>
	)
}

export default AddMembarModal
