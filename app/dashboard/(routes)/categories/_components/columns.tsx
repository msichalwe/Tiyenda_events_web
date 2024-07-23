'use client'

import { ColumnDef } from '@tanstack/react-table'
// import { CellAction } from './cell-action'
import { Event } from '@prisma/client'
import { CellAction } from './cell-action'

export type CategoryColumn = {
	id: string
	name: string
	description: string | null
	imageUrl: string
	isPublshed: boolean
}

export const columns: ColumnDef<CategoryColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'isPublshed',
		header: 'Published',
		cell: ({ row }) => (
			<span
				className={
					row.original.isPublshed
						? 'bg-green-500 px-4 py-2 rounded text-white'
						: 'bg-red-500 px-4 py-2 rounded text-white'
				}>
				{row.original.isPublshed ? 'Published' : 'Unpublished'}
			</span>
		),
	},
	{
		accessorKey: 'imageUrl',
		header: 'Image',
		cell: ({ row }) => (
			<img
				src={row.original.imageUrl}
				alt=""
				className="w-12 h-12 rounded-full"
			/>
		),
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
]
