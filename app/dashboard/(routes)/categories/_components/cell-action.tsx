'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { CategoryColumn } from './columns'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { Edit, MoreHorizontal, Pen, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

type CellActionProps = {
	data: CategoryColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter()

	const onDelete = async () => {
		try {
			await axios.delete(`/api/categories/${data.id}`)
			router.refresh()

			toast.success('Category Deleted')
		} catch (error) {
			console.log(error)
			toast.error('Oops! Something went wrong')
		}
	}

	const publish = async () => {
		try {
			await axios.post(`/api/categories/${data.id}/publish`, {
				isPublished: true,
			})
			router.refresh()

			toast.success('Category Published')
		} catch (error) {
			console.log(error)
			toast.error('Oops! Something went wrong')
		}
	}
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only ">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/catergories/${data.id}`)}>
						<Edit className="mr-2 h-4 w-4" />
						Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onDelete}>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
					<DropdownMenuItem onClick={publish}>
						<Pen className="mr-2 h-4 w-4" />
						Publish
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
