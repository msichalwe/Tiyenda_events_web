'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { cn } from '@/lib/utils'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	const onRefund = async (id: string) => {
		try {
			setIsLoading(true)
			await axios.patch('/api/tickets/refund', { refundId: id })
			toast.success('Refunded')
			router.refresh()
		} catch (error) {
			console.log(error)
			toast.error('Failed to refund')
		} finally {
			setIsLoading(false)
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
				<DropdownMenuItem
					className={cn(isLoading ? 'cursor-not-allowed' : 'cursor-pointer')}
					onClick={() =>
						// @ts-ignore
						onRefund(row.original.id)
					}>
					{isLoading ? 'Refunding...' : 'Refund'}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
