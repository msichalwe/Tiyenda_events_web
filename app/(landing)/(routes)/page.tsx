import Category from '@/app/components/category-section'
import Hero from '@/app/components/hero-section'
import FeaturedEvents from '@/app/components/featured-events-section'
import Search from '@/app/components/search'
import CategoryFilter from '@/app/components/category-filter'
import Collection from '@/app/dashboard/(routes)/search/_components/collection'
import { SearchParamProps } from '@/types'
import { getAllEvents } from '@/actions'
import NearByEvents from '@/app/components/nearby-events'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { currentUser } from '@/lib/auth'

export const revalidate = 0

export default async function Home({ searchParams }: SearchParamProps) {
	const page = Number(searchParams?.page) || 1
	const searchText = (searchParams?.query as string) || ''
	const category = (searchParams?.category as string) || ''

	const events = await getAllEvents({
		query: searchText,
		limit: 20,
		page,
		categoryId: category,
	})

	const user = await currentUser()

	return (
		<div className="bg-gray-50 space-y-10">
			<Hero />
			{/* <NearByEvents /> */}
			<Category />
			<FeaturedEvents />
			<div id="browse">
				<div className=" w-full px-10 lg:px-0 lg:w-4/6 mx-auto mb-20 py-10 h-full space-y-10">
					<div className="flex items-center justify-between">
						<h2 className="font-bold text-3xl">
							Browse <span className="text-orange-600">Events</span>
						</h2>
						<Link
							href="/events"
							className="hover:text-orange-600 cursor-pointer flex items-center justify-between font-medium">
							View All Events <ArrowRight className="h-4 w-4 ml-2" />
						</Link>
					</div>
					<div className="grid sm:grid-cols-4 grid-cols-1 gap-5 ">
						<div className="col-span-1 sm:col-span-3">
							<Search />
						</div>
						<div className="col-span-1">
							<CategoryFilter />
						</div>
					</div>
					<Collection
						// @ts-ignore
						data={events?.data}
						emptyTitle="No events found"
						emptyStateSubtext="Try again some other time"
						collectionType="All_Events"
						limit={10}
						page={1}
						totalPages={2}
					/>
				</div>
			</div>
		</div>
	)
}
