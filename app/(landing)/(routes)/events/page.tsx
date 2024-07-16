'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { fetchEvents } from '@/actions'
import EventCard, { EventCardProps } from '@/app/components/event-card'

let page = 1

const Events = () => {
	const { ref, inView } = useInView()

	const [data, setData] = useState<any[]>([])

	useEffect(() => {
		if (inView) {
			fetchEvents(page).then((res: any) => {
				setData([...data, ...res])
				page++
			})
		}
	}, [inView, data])

	return (
		<div className="min-h-screen  w-full px-10 lg:px-0 lg:w-4/6 mx-auto mb-20 py-20 h-full space-y-10">
			<h2 className="font-bold text-3xl">
				Explore More <span className="text-orange-600">Events</span>
			</h2>
			<section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
				{data.map((event, index: number) => (
					<EventCard
						key={event.id}
						index={index}
						event={event as EventCardProps['event']}
					/>
				))}
			</section>
			<section className="flex justify-center items-center w-full">
				<div ref={ref}></div>
			</section>
		</div>
	)
}

export default Events
