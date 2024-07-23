'use client'

import { ColumnDef } from '@tanstack/react-table'
// import { CellAction } from './cell-action'
import { Event } from '@prisma/client'
import { CellAction } from './cell-action'

export type UsersColumn = {
	id: string
	image: string | null
	name: string
	email: string
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
