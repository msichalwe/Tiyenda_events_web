'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'

export type UsersColumn = {
	id: string
	name: string
	email: string | null
	role: string
}

export const columns: ColumnDef<UsersColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email Address',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
]
