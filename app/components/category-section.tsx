import { db } from '@/lib/db'
import Image from 'next/image'

const Category = async () => {
	const categories = await db.category.findMany({
		where: {
			isPublshed: true,
		},
	})

	if (categories.length === 0) {
		return null
	}

	return (
		<div className="bg-gray-100">
			<div className="w-full px-10 lg:px-10 lg:w-4/6 mx-auto">
				<div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5 py-10">
					{categories.map((category, index) => (
						<div key={index} className="space-y-2 flex items-center flex-col ">
							<img
								className="rounded-full object-cover w-20 h-20"
								src={category.imageUrl}
								alt="image-event"
							/>
							<p className=" text-sm text-gray-600">{category.name}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Category
