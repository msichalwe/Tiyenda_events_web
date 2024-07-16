import { getAllEvents } from '@/actions'
import Collection from './_components/collection'
import Search from '@/app/components/search'
import { SearchParamProps } from '@/types'
import CategoryFilter from '@/app/components/category-filter'

export const revalidate = 0

const SearchPage = async ({ searchParams }: SearchParamProps) => {
	const page = Number(searchParams?.page) || 1
	const searchText = (searchParams?.query as string) || ''
	const category = (searchParams?.category as string) || ''

	const events = await getAllEvents({
		query: searchText,
		limit: 20,
		page,
		categoryId: category,
	})

	return (
		<div className="p-6 space-y-6 w-5/6 mx-auto">
			<h1 className="text-4xl font-black">Featured Events</h1>
			<div className="flex w-full flex-col gap-5 md:flex-row">
				<Search />
				<CategoryFilter />
			</div>
			<Collection
				// @ts-ignore
				data={events?.data}
				emptyTitle="No events found"
				emptyStateSubtext="Try again some other time"
				collectionType="Featured_Events"
				limit={6}
				page={1}
				totalPages={2}
			/>
		</div>
	)
}

export default SearchPage
