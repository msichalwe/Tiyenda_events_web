'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { FundsRequst } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<any>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: 'Organizer',
		cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => (
			<div className="capitalize">K{row.getValue('amount')}</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'availableAmount',
		header: 'Available Amount',
		cell: ({ row }) => (
			<div className="capitalize">K{row.getValue('availableAmount')}</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => <div className="">{row.getValue('date')}</div>,
		enableSorting: false,
		enableHiding: false,
	},

	{
		id: 'actions',
		cell: ({ row }) => {
			row.getValue('status') === 'PENDING' && <DataTableRowActions row={row} />
		},
	},
]
