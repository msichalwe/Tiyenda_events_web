import { auth } from '@/auth'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Tickets = async () => {
	const user = await currentUser()
	const orders = await db.order.findMany({
		where: {
			userId: user?.id,
		},
		include: {
			OrderItem: true,
			event: {
				include: {
					Category: true,
				},
			},
			Transaction: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})
	return (
		<section className="min-h-screen py-5 md:py-14">
			<div className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<h2 className="h2-bold">Your Tickets</h2>
				<div className=" grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 ">
					{orders.map((order) => (
						<div
							key={order.id}
							className="group relative flex min-h-[390px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
							<Link
								href={`/tickets/${order.id}`}
								style={{ backgroundImage: `url(${order.event.image})` }}
								className="flex-center flex-grow bg-gray-50 bg-center bg-cover text-grey-500"
							/>

							<Link
								href={`/tickets/${order.id}`}
								className="flex min-h-[130px] flex-col gap-2 p-5 md:gap-4">
								<div className="w-full flex items-center justify-between">
									<p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500">
										{/* @ts-ignore */}
										{order.event.Category.name}
									</p>
									<div>
										<p className="p-semibold-14 w-min rounded-full  px-4 py-1 text-gray-500">
											{/* @ts-ignore */}
											{order.status}
										</p>
									</div>
								</div>
								<p className="p-medium-14  text-gray-500">
									{format(new Date(order.event.startDate!), 'eeee')}•{' '}
									{format(new Date(order.event.startDate!), 'hh:mm a')}
								</p>
								<p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
									{order.event.name}
								</p>
								<p className="text-gray-500 text-xs">{order.event.address}</p>
								<p>{order.OrderItem.length} tickets</p>

								<div className="flex-between w-full">
									<p className="p-medium-14  text-gray-600">
										Order #{order?.orderNumber}
									</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Tickets
