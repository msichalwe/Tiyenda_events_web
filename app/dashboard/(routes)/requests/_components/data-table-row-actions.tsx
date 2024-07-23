'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	const router = useRouter()

	const [loading, setLoading] = useState(false)

	const onApprove = async (id: string) => {
		try {
			setLoading(true)
			await axios.patch(`/api/request-withdrawal/approval`, {
				id,
				status: 'APPROVED',
			})
			toast.success('Withdrawal request approved')
			router.refresh()
		} catch (error) {
			console.log(error)
			toast.error('Failed to approve withdrawal request')
		} finally {
			setLoading(false)
		}
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				{/* @ts-ignore */}
				<DropdownMenuItem onClick={() => onApprove(row.original.id)}>
					{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
