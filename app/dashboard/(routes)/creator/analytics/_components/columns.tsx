'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { DataTableColumnHeader } from './data-column-header'
import { labels, statuses } from '../_data/data'
import { DataTableRowActions } from './data-table-row-actions'
import { Transaction } from '../_data/transactionSchema'

export const columns: ColumnDef<Transaction>[] = [
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
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
		cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'phoneNumber',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Phone Number" />
		),
		cell: ({ row }) => (
			<div className="w-[80px]">{row.getValue('phoneNumber')}</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		cell: ({ row }) => {
			const label = labels.find((label) => label.value === row.original.name)

			return (
				<div className="flex space-x-2">
					{label && <Badge variant="outline">{label.label}</Badge>}
					<span className="max-w-[500px] truncate font-medium">
						ZMW {row.getValue('amount')}
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created Date" />
		),
		cell: ({ row }) => (
			<div className="w-[80px]">{row.getValue('phoneNumber')}</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = statuses.find(
				(status) => status.value === row.getValue('status'),
			)

			if (!status) {
				return null
			}

			return (
				<div className="flex w-[80px] items-center">
					{status.icon && (
						<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{status.label}</span>
				</div>
			)
		},
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: 'event',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event" />
		),
		enableSorting: false,
		enableHiding: false,
	},

	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
]
