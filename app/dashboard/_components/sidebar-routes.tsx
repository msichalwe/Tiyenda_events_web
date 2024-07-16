'use client'

import {
	Album,
	BarChart,
	Calendar,
	CalendarPlus,
	Compass,
	Group,
	Layout,
	List,
	Ticket,
	TicketIcon,
	TicketMinusIcon,
	User,
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { UserRole } from '@prisma/client'
import { FaMoneyBill } from 'react-icons/fa'

export const SidebarRoutes = () => {
	const session = useSession()
	const pathname = usePathname()

	if (!session?.data?.user?.role) return null

	const guestRoutes = [
		{
			icon: Layout,
			label: 'Dashboard',
			href: '/dashboard',
		},
		session.data.user.role === UserRole.ADMIN && {
			icon: Calendar,
			label: 'Events',
			href: '/dashboard/events',
		},
		{
			icon: Compass,
			label: 'Browse',
			href: '/dashboard/search',
		},
		session.data.user.role === UserRole.ADMIN && {
			icon: Album,
			label: 'Categories',
			href: '/dashboard/categories',
		},
		session.data.user.role === UserRole.ADMIN && {
			icon: User,
			label: 'Admin Manangement',
			href: '/dashboard/admin',
		},
		session.data.user.role === UserRole.ADMIN && {
			icon: TicketIcon,
			label: 'Requests',
			href: '/dashboard/requests',
		},
	].filter(Boolean)

	const eventCreatorRoutes = [
		{
			icon: Calendar,
			label: 'Events',
			href: '/dashboard/creator/events',
		},
		{
			icon: BarChart,
			label: 'Analytics',
			href: '/dashboard/creator/analytics',
		},
		{
			icon: Group,
			label: 'Organizers',
			href: '/dashboard/creator/organizers',
		},
		{
			icon: FaMoneyBill,
			label: 'Funds',
			href: '/dashboard/creator/funds',
		},
		{
			icon: TicketMinusIcon,
			label: 'Refunds',
			href: '/dashboard/creator/refunds',
		},
	]

	const isEventCreatorPage = pathname?.includes('/dashboard/creator')

	const routes = isEventCreatorPage ? eventCreatorRoutes : guestRoutes

	return (
		<div className="flex flex-col w-full">
			{routes.map((route: any) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	)
}
