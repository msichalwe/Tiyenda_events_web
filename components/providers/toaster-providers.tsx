'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

export const ToasterProvider = () => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}
	return <Toaster />
}
