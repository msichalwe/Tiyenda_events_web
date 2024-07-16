'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrgsnizerColumn } from './columns'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { Edit, MoreHorizontal } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ExitFullScreenIcon, ExitIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { toast } from 'sonner'

type CellActionProps = {
	data: OrgsnizerColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter()

	const user = useCurrentUser()

	const onDelete = async () => {
		try {
			await axios.delete(`/api/organizer/${data.id}/user/${user?.id}`)
			toast.success(`You have left ${data.name}`)
			router.refresh()
		} catch (error) {
			console.log(error)
			toast.error('Oops..Something went wrong')
		}
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{user?.organizerRole === 'OWNER' && (
						<DropdownMenuItem
							onClick={() =>
								router.push(`/dashboard/creator/organizers/${data.id}`)
							}>
							<Edit className="mr-2 h-4 w-4" />
							Update
						</DropdownMenuItem>
					)}
					{user?.organizerRole === 'USER' && (
						<DropdownMenuItem className="text-red-500" onClick={onDelete}>
							<ExitIcon className="mr-2 h-4 w-4" />
							Leave
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
