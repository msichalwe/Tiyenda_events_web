'use client'
import EventCard, { EventCardProps } from '@/app/components/event-card'
import { Event } from '@prisma/client'
import React from 'react'

type CollectionProps = {
	data: any[]
	emptyTitle: string
	emptyStateSubtext: string
	limit: number
	page: number | string
	totalPages?: number
	urlParamName?: string
	collectionType?: 'Events_Organized' | 'All_Events' | 'Featured_Events'
}

const Collection: React.FC<CollectionProps> = ({
	data,
	emptyTitle,
	emptyStateSubtext,
	collectionType,
	limit,
	page,
	totalPages,
}) => {
	return (
		<>
			{data.length > 0 ? (
				<div className="flex flex-col items-center gap-10">
					<ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
						{data.map((event, index: number) => {
							const hasFeaturedToggle = collectionType === 'Featured_Events'

							return (
								<li key={event.id} className="flex justify-center">
									<EventCard
										index={index}
										event={event as EventCardProps['event']}
										hasFeaturedToggle={hasFeaturedToggle}
									/>
								</li>
							)
						})}
					</ul>
				</div>
			) : (
				<div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-gray-50 oy-28 text-center">
					<h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
					<p className="p-regular-14 ">{emptyStateSubtext}</p>
				</div>
			)}
		</>
	)
}

export default Collection
