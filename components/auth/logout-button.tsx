'use client'
import { logout } from '@/actions/logout'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
	children: React.ReactNode
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = () => {
		logout()
	}

	return (
		<span className="cursor-pointer" onClick={onClick}>
			{children}
		</span>
	)
}

export default LogoutButton
