'use client'
import { TicketProps } from '@/app/dashboard/_components/ticket'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel'
import axios from 'axios'
import { format } from 'date-fns'
import { Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const TicketClient: React.FC<TicketProps> = ({
	data,
	title,
	orderNumber,
	user,
}) => {
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [count, setCount] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	useEffect(() => {
		if (!api) {
			return
		}

		setCount(api.scrollSnapList().length)
		setCurrent(api.selectedScrollSnap() + 1)

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1)
		})
	}, [api])

	const checkInTicket = async (id: string) => {
		try {
			setIsLoading(true)
			await axios.post(`/api/order-item/${id}`)
			toast.success('Checked In Successfully!')
			router.refresh()
		} catch (error) {
			console.log(error)
			toast.error('Oops... Something went wrong')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<Carousel setApi={setApi}>
				<CarouselContent>
					{data.map((item) => (
						<CarouselItem key={item.id}>
							<div className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
								<div>
									<h1 className="font-bold text-2xl my-4 text-center text-orange-600">
										{title}
									</h1>
									<hr className="mb-2" />
									<div className="flex justify-between mb-6">
										<h1 className="text-lg font-bold">Order</h1>
										<div className="text-gray-700">
											<div>Date: {format(item.createdAt, 'dd MMMM yyyy')}</div>
											<div>Order #:{orderNumber}</div>
										</div>
									</div>
									<div className="mb-8">
										<h2 className="text-lg font-bold mb-4">Bill To:</h2>
										<div className="text-gray-700 mb-2">{user?.name}</div>
										<div className="text-gray-700 mb-2">{user.email}</div>
									</div>
								</div>
								<table className="w-full mb-8">
									<thead>
										<tr>
											<th className="text-left font-bold text-gray-700">
												Price
											</th>
											<th className="text-right font-bold text-gray-700">
												Status
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="text-left text-gray-700">K{item.price}</td>
											<td className="text-right text-gray-700">
												{item.status}
											</td>
										</tr>
									</tbody>
								</table>
								<div className="flex flex-col items-center justify-center w-full">
									<Image
										src={item.qrcode!}
										alt="qrcode"
										height={150}
										width={150}
									/>
									<Button
										className="w-full"
										disabled={isLoading}
										onClick={() => checkInTicket(item.id)}>
										{isLoading ? (
											<>
												<Loader2 className="animate-spin h-4 w-4" />
											</>
										) : (
											<>
												<Check className="mr-2 h-4 w-4" /> Check In
											</>
										)}
									</Button>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<div className="py-2 text-center text-sm text-muted-foreground">
				Ticket {current} of {count}
			</div>
		</div>
	)
}

export default TicketClient
