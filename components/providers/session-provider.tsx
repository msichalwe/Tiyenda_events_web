'use client'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Toaster } from 'sonner'

type ContextProviderProps = {
	children: React.ReactNode
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}
	return (
		<SessionProvider>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				{children}
				<Toaster />
			</LocalizationProvider>
		</SessionProvider>
	)
}

export default ContextProvider
