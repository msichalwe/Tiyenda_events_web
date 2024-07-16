import React from 'react'
import { db } from '@/lib/db'

import EventCard from './event-card'
import Collection from '../dashboard/(routes)/search/_components/collection'
import { getAllFeaturedEvents } from '@/actions'

export const revalidate = 0

const FeaturedEvents = async () => {
	const events = await getAllFeaturedEvents({
		query: '',
		limit: 6,
		page: 1,
		categoryId: '',
	})

	return (
		<div>
			<div className=" w-full px-10 lg:px-0 lg:w-4/6 mx-auto mb-20 py-10 h-full space-y-10">
				<h2 className="font-bold text-3xl">
					Featured <span className="text-orange-600">Events</span>
				</h2>
				<Collection
					// @ts-ignore
					data={events?.data}
					emptyTitle="No events found"
					emptyStateSubtext="Try again some other time"
					collectionType="All_Events"
					limit={6}
					page={1}
					totalPages={2}
				/>
			</div>
		</div>
	)
}

export default FeaturedEvents
