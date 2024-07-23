import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import Logo from '@/app/dashboard/_components/logo'

const font = Poppins({
	subsets: ['latin'],
	weight: ['600'],
})

interface HeaderProps {
	label: string
}

export const Header = ({ label }: HeaderProps) => {
	return (
		<div className={`w-full flex flex-col gap-y-4 items-center justify-center`}>
			<Logo />
			<h1 className={cn('text-2xl font-medium')}>{label}</h1>
		</div>
	)
}
