'use client'

import { ColumnDef } from '@tanstack/react-table'
// import { CellAction } from './cell-action'
import { Event } from '@prisma/client'
import { CellAction } from './cell-action'

export type EventColumn = {
	id: string
	image: string | null
	name: string
	month: string | null
	location: string | null
	startTime: string | null
	isPublished: boolean
	startDate: string | null
	startDay: string | null
	sold: number | null
}

export const columns: ColumnDef<EventColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Event',
		cell: ({ row }) => (
			<div className=" text-slate-600 flex font-medium items-center gap-7 pl-5">
				<div className="flex flex-col items-center justify-center">
					<p className="text-sm text-red-500 uppercase">{row.original.month}</p>
					<p className="text-2xl text-slate-700">{row.original.startDay}</p>
				</div>
				<img
					src={
						row.original.image === null
							? 'https://placehold.co/600x400'
							: row.original.image
					}
					alt="cover"
					className="w-20 h-20 rounded object-cover "
				/>
				<div>
					<p className="text-lg  mb-1">{row.original.name}</p>
					<p className="text-slate-500">{row.original.location}</p>
					<div className="flex gap-x-2">
						<p className="text-slate-500">{row.original.startDate}</p>
						<p className="text-slate-500">{row.original.startTime}</p>
					</div>
				</div>
			</div>
		),
	},
	{
		accessorKey: 'sold',
		header: 'Sold',
		cell: ({ row }) => (
			<div className=" font-medium text-slate-700">{row.original.sold}</div>
		),
	},
	{
		accessorKey: 'isPublished',
		header: 'Status',
		cell: ({ row }) => (
			<div className=" font-medium text-slate-700">
				{row.original.isPublished ? 'Published' : 'Draft'}
			</div>
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
]
