'use client'

import { DataTable } from '@/components/ui/data-table'
import { OrderColumn, columns } from './columns'

type OrdersProps = {
	data: OrderColumn[]
}

const OrdersClient: React.FC<OrdersProps> = ({ data }) => {
	return (
		<div>
			<DataTable columns={columns} data={data} searchKey="name" />
		</div>
	)
}

export default OrdersClient
