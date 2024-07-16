import { IconBadge } from '@/components/icon-badge'
import { Button } from '@/components/ui/button'
import { Album, Group } from 'lucide-react'
import CategoryForm from './_components/category-form'
import { DataTable } from '@/components/ui/data-table'
import { CategoryColumn, columns } from './_components/columns'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export const revalidate = 0
const Categories = async () => {
	const session = await auth()

	const categories = await db.category.findMany({})

	const formattedCategories: CategoryColumn[] = categories.map((category) => {
		return {
			id: category.id,
			name: category.name,
			description: category.description,
			isPublshed: category.isPublshed,
			imageUrl: category.imageUrl,
		}
	})

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-x-2">
					<h1 className="text-2xl font-medium">Categories</h1>
				</div>
			</div>
			<div className="w-4/6 mx-auto flex justify-around flex-col gap-6 mt-16">
				<div>
					<div className="flex  items-center gap-x-2">
						<IconBadge icon={Album} />
						<h2 className="text-xl">Create New Category</h2>
					</div>
					<CategoryForm />
				</div>
				<div className="mt-20">
					<div className="flex items-center gap-x-2">
						<IconBadge icon={Album} />
						<h2 className="text-xl  ">All Categories</h2>
					</div>
					<DataTable
						columns={columns}
						data={formattedCategories}
						searchKey="name"
					/>
				</div>
			</div>
		</div>
	)
}

export default Categories
