import { IconBadge } from '@/components/icon-badge'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { LayoutDashboard, User2, UserPlus, Users } from 'lucide-react'
import NameForm from './_components/name-form'
import DescriptionForm from './_components/description-form'
import ImageForm from './_components/image-form'
import ContactForm from './_components/contact-form'
import SocialsForm from './_components/socials-form'
import AddMemberButton from './_components/add-member-button'
import { SearchParamProps } from '@/types'
import { getAllUsers } from '@/actions'
import AddMembarModal from '@/components/ui/modal/add-member-modal'
import { auth } from '@/auth'
import { DataTable } from '@/components/ui/data-table'
import { UsersColumn, columns } from './_components/columns'

export const revalidate = 0

type OrganizerProps = {
	params: {
		organizerId: string
	}
	searchParams: SearchParamProps
}

const Organizer: React.FC<OrganizerProps> = async ({
	params,
	searchParams,
}) => {
	const session = await auth()

	if (!session?.user.id) {
		return redirect('/')
	}

	// @ts-ignore
	const searchText = (searchParams?.query as string) || ''

	const users = await getAllUsers({
		limit: 10,
		query: searchText,
	})

	const organizer = await db.organizer.findUnique({
		where: {
			id: params.organizerId,
		},
		include: {
			users: true,
		},
	})

	if (!organizer) {
		return redirect('/dashboard/creator/organizers')
	}

	const formattedUsers: UsersColumn[] = organizer?.users.map((user) => {
		return {
			id: user.id,
			name: user.name!,
			email: user.email!,
			role: user.organizerRole!,
		}
	})

	const requiredFields = [
		organizer.name,
		organizer.imageUrl,
		organizer.description,
		organizer.contactEmail,
		organizer.contactPhone,
	]

	const totalFields = requiredFields.length

	const completedFields = requiredFields.filter(Boolean).length

	const completionText = `(${completedFields}/${totalFields})`

	return (
		<>
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-x-2">
						<h1 className="text-2xl font-medium">Organizer setup</h1>
						<span className="text-sm text-slate-700">
							Complete all fields {completionText}
						</span>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={User2} />
							<h2 className="text-xl">Customize your Organizer</h2>
						</div>
						<NameForm initialData={organizer} organizerId={organizer.id} />
						<DescriptionForm
							initialData={organizer}
							organizerId={organizer.id}
						/>
						<ImageForm initialData={organizer} organizerId={organizer.id} />
						<ContactForm initialData={organizer} organizerId={organizer.id} />
						<SocialsForm initialData={organizer} organizerId={organizer.id} />
					</div>
					<div>
						<div className="flex items-center justify-between gap-x-2">
							<div className="flex items-center gap-x-2">
								<IconBadge icon={Users} />
								<h2 className="text-xl">Manage Access</h2>
							</div>
							<AddMemberButton />
						</div>
						<DataTable
							data={formattedUsers}
							columns={columns}
							searchKey="name"
						/>
					</div>
				</div>
			</div>
			<AddMembarModal data={users} organizerId={params.organizerId} />
		</>
	)
}

export default Organizer
