'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { UsersColumn } from './columns'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

type CellActionProps = {
	data: UsersColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	const onDelete = async () => {
		try {
			await axios.delete(`/api/organizer/${params.organizer}/user/${data.id}`)
			toast.success(`${data.name} has been removed.`)
			router.refresh()
		} catch (error) {
			console.log(error)
			toast.error('Oops..Something went wrong')
		}
	}

	return (
		<>
			{data.role === 'USER' && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							className="text-red-500 cursor-pointer"
							onClick={onDelete}>
							<Trash className="mr-2 h-4 w-4" />
							Remove
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	)
}
