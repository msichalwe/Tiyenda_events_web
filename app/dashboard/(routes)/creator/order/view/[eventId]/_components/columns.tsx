'use client'

import { ColumnDef } from '@tanstack/react-table'
// import { CellAction } from './cell-action'
import { Event } from '@prisma/client'
import { CellAction } from './cell-action'
import Link from 'next/link'

export type OrderColumn = {
	id: string
	orderNumber: number
	buyer: string | null
	date: string
	tickets: number
	total: number
}

export const columns: ColumnDef<OrderColumn>[] = [
	{
		accessorKey: 'orderNumber',
		header: 'Order',
		cell: ({ row }) => (
			<p className=" font-medium">#{row.original.orderNumber}</p>
		),
	},
	{
		accessorKey: 'buyer',
		header: 'Buyer',
	},
	{
		accessorKey: 'date',
		header: 'Purchase Date',
	},
	{
		accessorKey: 'tickets',
		header: 'Number of Tickets',
	},
	{
		accessorKey: 'total',
		header: 'Total',
		cell: ({ row }) => <span>K{row.original.total}</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
]
