import getCurrentUser from '@/app/actions/getCurrentUser'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import UserssClient from './_components/client'
import { UsersColumn } from './_components/columns'

const Admin = async () => {
	const user = await getCurrentUser()

	if (user?.role !== 'ADMIN') {
		redirect('/')
	}

	console.log(user);

	const users = await db.user.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	})


	// @ts-ignore
	const formattedUsers: UsersColumn[] = users.map((user) => {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			image: user.image,
		}
	})

	return (
		<div className="p-6 space-y-6 w-5/6 mx-auto">
			<div className="w-full flex items-center justify-between">
				<h1 className="text-4xl font-black mb-5">
					Users ({formattedUsers.length})
				</h1>
			</div>
			<UserssClient data={formattedUsers} />
		</div>
	)
}

export default Admin
