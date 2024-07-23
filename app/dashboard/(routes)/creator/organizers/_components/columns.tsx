'use client'

import { ColumnDef } from '@tanstack/react-table'
// import { CellAction } from './cell-action'
import { Event } from '@prisma/client'
import { CellAction } from './cell-action'

export type OrgsnizerColumn = {
	id: string
	name: string
	description: string | null
}

export const columns: ColumnDef<OrgsnizerColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
]
