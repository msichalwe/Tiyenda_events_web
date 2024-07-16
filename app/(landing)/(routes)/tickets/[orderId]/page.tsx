import { db } from '@/lib/db'
import React from 'react'
import ViewTicket from '../_components/view-ticket'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import verifyToken from '@/actions/payments'
import VerifyButton from './[ticketId]/_components/verify-button'

const Order = async ({ params }: { params: { orderId: string } }) => {
	const order = await db.order.findUnique({
		where: {
			id: params.orderId,
		},
		include: {
			OrderItem: {
				include: {
					ticket: true,
				},
			},
			event: {
				include: {
					Category: true,
				},
			},
			Transaction: true,
		},
	})

	const availableOrderItems = order?.OrderItem.filter(
		(item) => item.status !== 'USED',
	)

	const usedOrderItems = order?.OrderItem.filter(
		(item) => item.status === 'USED',
	)

	const uniqueAvailableOrderItems = availableOrderItems?.filter(
		(item, index) => {
			return (
				availableOrderItems.findIndex(
					(prevItem) => prevItem.ticket.id === item.ticket.id,
				) === index
			)
		},
	)

	const uniqueUsedOrderItems = usedOrderItems?.filter((item, index) => {
		return (
			usedOrderItems.findIndex(
				(prevItem) => prevItem.ticket.id === item.ticket.id,
			) === index
		)
	})

	const uniqueTicketObjects = uniqueAvailableOrderItems?.map((item) => {
		const count = availableOrderItems?.filter(
			(otherItem) => otherItem.ticket.id === item.ticket.id,
		).length
		return {
			ticket: item.ticket,
			count,
		}
	})

	const uniqueUsedTicketObjects = uniqueUsedOrderItems?.map((item) => {
		const count = usedOrderItems?.filter(
			(otherItem) => otherItem.ticket.id === item.ticket.id,
		).length
		return {
			ticket: item.ticket,
			count,
		}
	})

	const onVerfiyPayment = async () => {
		'use server'
		const verify = await verifyToken({
			transactionToken: order?.Transaction[-1].transactionToken!,
			companyRef: order?.event.id!,
		})
	}

	return (
		<section className="min-h-screen py-5 md:py-14">
			<div className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<div className="flex flex-col gap-2">
					<h2 className="h2-bold">{order?.event.name}</h2>
					<p className="p-medium-16 text-gray-500">
						Order #{order?.orderNumber}
					</p>
				</div>
				<div className="space-y-4">
					<h2 className="font-medium text-xl">
						Available Tickets ({availableOrderItems?.length})
					</h2>
					<div className=" grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 ">
						{uniqueTicketObjects?.map((item) => (
							<div
								className="bg-gray-100 p-4 rounded-md flex flex-col space-y-4"
								key={item.ticket.id}>
								<div className="flex items-center gap-2">
									<span className="font-bold">{item.ticket.name}</span>
									<span
										className={cn(
											`p-semibold-14 w-min rounded-full  px-4 py-1 `,
											order?.status === 'COMPLETED' &&
												'bg-green-100 text-green-500',
											order?.status === 'PENDING' &&
												'bg-orange-100 text-orange-500',
											order?.status === 'REFUNDED' && 'bg-red-100 text-red-500',
										)}>
										{order?.status?.toUpperCase()}
									</span>
								</div>
								<span className="">Total Tickets: {item.count}</span>
								<div className="flex items-center justify-between w-full">
									{order?.status === 'COMPLETED' && (
										<Button asChild>
											<Link
												href={`/tickets/${params.orderId}/${item.ticket.id}`}>
												View Tickets
											</Link>
										</Button>
									)}
									{order?.status === 'PENDING' && (
										<VerifyButton
											transactionToken={
												order?.Transaction[-1]?.transactionToken!
											}
											companyRef={order?.eventId!}
										/>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
				<div>
					<h2 className="font-medium text-xl">
						Used Tickets ({usedOrderItems?.length})
					</h2>
					<div className=" grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 ">
						{uniqueUsedTicketObjects?.map((item) => (
							<div
								className="bg-gray-100 p-4 rounded-md flex flex-col gap-2"
								key={item.ticket.id}>
								<div className="flex items-center gap-2">
									<span className="font-bold">{item.ticket.name}</span>
									<span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-500">
										{item.ticket.type?.toUpperCase()}
									</span>
								</div>
								<span className="">Total Tickets: {item.count}</span>
								<Button asChild>
									<Link
										href={`/tickets/${params.orderId}/used/${item.ticket.id}`}>
										View Tickets
									</Link>
								</Button>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Order
