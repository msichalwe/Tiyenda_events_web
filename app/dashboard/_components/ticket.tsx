'use client'
import { OrderItem, User } from '@prisma/client'
import React from 'react'

export interface TicketProps {
	data: OrderItem[]
	user: User
	title: string
	orderNumber: number
}

const Ticket: React.FC<TicketProps> = ({ data, title }) => {
	return (
		<div className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
			<h1 className="font-bold text-2xl my-4 text-center text-orange-600">
				{title}
			</h1>
			<hr className="mb-2" />
			<div className="flex justify-between mb-6">
				<h1 className="text-lg font-bold">Order</h1>
				<div className="text-gray-700">
					<div>Date:</div>
					<div>Order #:</div>
				</div>
			</div>
			<div className="mb-8">
				<h2 className="text-lg font-bold mb-4">Bill To:</h2>
				<div className="text-gray-700 mb-2">John Doe</div>
				<div className="text-gray-700 mb-2">123 Main St.</div>
				<div className="text-gray-700 mb-2">Anytown, USA 12345</div>
				<div className="text-gray-700">johndoe@example.com</div>
			</div>
		</div>
	)
}

export default Ticket
