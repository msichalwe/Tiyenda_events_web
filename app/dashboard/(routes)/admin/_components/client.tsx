'use client'

import { DataTable } from '@/components/ui/data-table'
import { UsersColumn, columns } from './columns'

type UsersProps = {
	data: UsersColumn[]
}

const UserssClient: React.FC<UsersProps> = ({ data }) => {
	return (
		<div>
			<DataTable columns={columns} data={data} searchKey="name" />
		</div>
	)
}

export default UserssClient
