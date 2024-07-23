'use client'

import { useOrderModal } from '@/hooks/use-order-modal'
import { Modal } from './modal'
import { useParams, useRouter } from 'next/navigation'
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import { Loader2 } from 'lucide-react'
import { Ticket } from '@prisma/client'

import { useState } from 'react'
import { Button } from '../button'
import { Separator } from '../separator'
import { format, set } from 'date-fns'
import axios from 'axios'
import { toast } from 'sonner'

interface OrderModalProps {
	isOpen: boolean
}

interface CounterProps {
	count: number
	increment: () => void
	decrement: () => void
	max?: number
}

interface OrderSummaryProps {
	ticketCounts: Record<string, number>
	event: Event & { Ticket: Ticket[] }
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen }) => {
	const params = useParams()

	const orderModal = useOrderModal()

	const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({})

	const increment = (id: string) => {
		setTicketCounts({
			...ticketCounts,
			[id]: (ticketCounts[id] || 0) + 1,
		})
	}

	const decrement = (id: string) => {
		setTicketCounts({
			...ticketCounts,
			[id]: ticketCounts[id] > 0 ? ticketCounts[id] - 1 : 0,
		})
	}

	const { data: event, isLoading } = useSWR(
		`/api/events/${params.eventId}`,
		fetcher,
	)

	if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />

	return (
		<Modal
			title={`${event.name} Tickets`}
			description="Select the number of tickets you want to order"
			isOpen={orderModal.isOpenOrder}
			onClose={orderModal.onCloseOrder}>
			<div className=" grid grid-cols-5 min-h-[60vh] w-full gap-5">
				<div className="col-span-3 space-y-4">
					{event.Ticket.map((ticket: Ticket) => (
						<div
							className={`flex flex-col items-center border ${
								ticketCounts[ticket.id] > 0
									? 'border-orange-600'
									: 'border-gray-200'
							} border-2 rounded-2xl p-2`}
							key={ticket.id}>
							<div className="flex items-start justify-between p-2 w-full">
								<h3 className="text-sm text-slate-500">{ticket.name}</h3>
								<Counter
									count={ticketCounts[ticket.id] || 0}
									increment={() => increment(ticket.id)}
									decrement={() => decrement(ticket.id)}
								/>
							</div>
							<Separator />
							<div className="w-full text-left py-5 px-2">
								<p className="text-sm text-slate-500">
									<span className="text-base font-medium text-slate-900">
										K{ticket.price}
									</span>{' '}
									excludes taxes and fees
								</p>
								<p className="text-sm font-medium">
									Sale ends on{' '}
									{format(new Date(ticket.endDate!), 'd MMMM yyyy')}
								</p>
							</div>
						</div>
					))}
				</div>
				<div className="col-span-2">
					{Object.keys(ticketCounts).length > 0 && (
						<OrderSummary ticketCounts={ticketCounts} event={event} />
					)}
				</div>
			</div>
		</Modal>
	)
}

const Counter: React.FC<CounterProps> = ({
	count,
	max,
	increment,
	decrement,
}) => {
	return (
		<div className="flex gap-5 text-xl text-white font-bold items-center">
			<Button
				size={'icon'}
				variant={'outline'}
				className="bg-orange-600"
				disabled={count === 0 || (max !== undefined && count >= max)} // Clearer boolean expression
				onClick={decrement}>
				-
			</Button>
			<span className="text-slate-700 text-xl font-bold">{count}</span>
			<Button
				size={'icon'}
				variant={'outline'}
				className="bg-orange-600"
				disabled={max !== undefined && count >= max} // Disable if max is reached
				onClick={increment}>
				+
			</Button>
		</div>
	)
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ ticketCounts, event }) => {
	const params = useParams()
	const router = useRouter()

	const [transToken, setTransToken] = useState('' as string)

	const [isLoading, setIsLoading] = useState(false)

	const subtotal = event.Ticket.reduce(
		(total, ticket) =>
			total + (ticketCounts[ticket.id] || 0) * parseFloat(ticket.price!),
		0,
	)

	const fees = subtotal * 0.1 // Assuming fees are 10% of the subtotal
	const tax = subtotal * 0.1 // Assuming tax is 10% of the subtotal
	const total = subtotal

	const onPurchase = async () => {
		try {
			setIsLoading(true)

			const tickets = event.Ticket.map((ticket) => ({
				id: ticket.id,
				quantity: ticketCounts[ticket.id] || 0,
				price: ticket.price,
			}))

			const response = await axios.post('/api/payment', {
				total: total,
				eventId: params.eventId,
			})

			await axios.post('/api/order', {
				eventId: params.eventId,
				total: total,
				tickets: tickets,
				transactionToken: response.data.data.API3G.TransToken._text,
			})

			toast.success('Order made successfully')
			router.push(
				`${process.env.NEXT_PUBLIC_DPO_PAYMENT_URL}${response.data.data.API3G.TransToken._text}`,
			)
		} catch (error: any) {
			console.log(error)
			toast.error(`${error.response.data}`)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className=" text-left p-5 w-full min-w-[200px] h-full space-y-5">
			<h2 className="text-sm mb-10">Order summary</h2>
			{event.Ticket.map((ticket) => (
				<p key={ticket.id} className="text-sm text-slate-700 mb-2">
					{ticketCounts[ticket.id] || 0} x {ticket.name}
					<span className="float-right">
						K{parseFloat(ticket.price!).toFixed(2)}
					</span>
				</p>
			))}
			<Separator />
			<p className="text-sm text-slate-700 mb-2">
				Subtotal<span className="float-right">K{subtotal.toFixed(2)}</span>
			</p>
			{/* <p className="text-sm text-slate-700 mb-2">
				Fees <span className="float-right">K{fees.toFixed(2)}</span>
			</p> */}
			<Separator />

			<div className="flex items-center justify-between">
				<p className="text-xl font-bold">Total </p>
				<p className="text-xl font-bold">K{total.toFixed(2)} </p>
			</div>

			<p className="text-xs text-right text-slate-500">Price includes tax</p>
			<Button onClick={onPurchase} disabled={isLoading} className="w-full">
				{isLoading ? (
					<Loader2 className="text-white animate-spin w-4 h-4" />
				) : (
					'Checkout'
				)}
			</Button>
		</div>
	)
}

export default OrderModal
