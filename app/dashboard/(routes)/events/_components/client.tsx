'use client'

import { DataTable } from '@/components/ui/data-table'
import { EventColumn, columns } from './columns'

type EventsProps = {
	data: EventColumn[]
}

const EventsClient: React.FC<EventsProps> = ({ data }) => {
	return (
		<div>
			<DataTable columns={columns} data={data} searchKey="name" />
		</div>
	)
}

export default EventsClient
