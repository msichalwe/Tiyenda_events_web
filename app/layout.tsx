import { ToasterProvider } from '@/components/providers/toaster-providers'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ContextProvider from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Tiyenda Events',
	description: '',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ContextProvider>
					<ToasterProvider />
					{children}
				</ContextProvider>
			</body>
			{/* <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script> */}
		</html>
	)
}
