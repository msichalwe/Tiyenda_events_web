'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { EventColumn } from './columns'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { Edit, Eye, MoreHorizontal } from 'lucide-react'

type CellActionProps = {
	data: EventColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter()
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
					<DropdownMenuItem
						onClick={() =>
							router.push(`/dashboard/creator/events/view/${data.id}`)
						}>
						<Eye className="mr-2 h-4 w-4" />
						View
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/creator/events/${data.id}`)}>
						<Edit className="mr-2 h-4 w-4" />
						Update
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
