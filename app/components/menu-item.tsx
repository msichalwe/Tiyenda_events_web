'use client'

import { cn } from '@/lib/utils'

interface MenuItemProps {
	onClick: () => void
	label: string
	className?: string
}

export const MenuItem = ({ onClick, label, className }: MenuItemProps) => {
	return (
		<div
			className={cn(
				'px-4 py-3 cursor-pointer text-sm hover:bg-neutral-100',
				className,
			)}
			onClick={onClick}>
			{label}
		</div>
	)
}
