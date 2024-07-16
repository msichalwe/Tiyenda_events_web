import { IconBadge } from '@/components/icon-badge'
import { Button } from '@/components/ui/button'
import { Group } from 'lucide-react'
import OrganizerForm from './_components/organizer-form'
import { DataTable } from '@/components/ui/data-table'
import { OrgsnizerColumn, columns } from './_components/columns'
import { db } from '@/lib/db'

import Link from 'next/link'
import { auth } from '@/auth'
import getCurrentUser from '@/app/actions/getCurrentUser'

export const revalidate = 0
const Organizers = async () => {
	const session = await auth()

	const organizers = await db.organizer.findMany({
		where: {
			users: {
				some: {
					id: session?.user?.id,
				},
			},
		},
	})

	const formattedOrganizers: OrgsnizerColumn[] = organizers.map((organizer) => {
		return {
			id: organizer.id,
			name: organizer.name,
			description: organizer.description,
		}
	})

	const user = await getCurrentUser()

	return (
		<div className="p-6 w-5/6 mx-auto">
			<div className="flex items-center justify-between">
				<div className="w-full flex items-center justify-between">
					<h1 className="text-4xl font-black mb-5">My Organizers</h1>
					{user?.organizerId === null && (
						<Link href="/dashboard/creator/create/organizer">
							<Button>New Organizer</Button>
						</Link>
					)}
				</div>
			</div>
			<div className=" flex justify-around flex-col gap-6 mt-16">
				<div>
					<DataTable
						columns={columns}
						data={formattedOrganizers}
						searchKey="name"
					/>
				</div>
			</div>
		</div>
	)
}

export default Organizers
