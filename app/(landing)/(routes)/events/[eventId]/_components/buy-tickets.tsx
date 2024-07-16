'use client'

import { Button } from '@/components/ui/button'
import OrderModal from '@/components/ui/modal/order-modal'
import { useOrderModal } from '@/hooks/use-order-modal'

const BuyTicket = () => {
	const isOpen = useOrderModal((state) => state.isOpenOrder)
	const onOpen = useOrderModal((state) => state.onOpenOrder)

	return (
		<>
			<OrderModal isOpen={isOpen} />
			<Button onClick={onOpen} className="w-full">
				Get Tickets
			</Button>
		</>
	)
}

export default BuyTicket
