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

	const onCancel = async (id: string) => {
		setIsLoading(true)

		try {
			await axios.delete(`/api/request-withdrawal/${id}`)

			toast.success('Withdrawal request has been cancelled')

			router.refresh()
		} catch (error) {
			toast.error('Failed to cancel withdrawal request')
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
						onCancel(row.original.id)
					}>
					{isLoading ? 'Cancelling' : 'Cancel'}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
