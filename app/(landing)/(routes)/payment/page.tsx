'use client'
import verifyToken from '@/actions/payments'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const Payment = () => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const transID = searchParams.get('TransID')
	const ccdApproval = searchParams.get('CCDapproval')
	const pnrID = searchParams.get('PnrID')
	const transactionToken = searchParams.get('TransactionToken')
	const companyRef = searchParams.get('CompanyRef')

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.post('/api/verify-payment', {
					transactionToken,
					companyRef,
				})

				console.log(response)
				router.push('/tickets')
			} catch (error) {
				toast.error('Error verifying payment')
				router.push('/tickets')
				console.error('Error verifying token:', error)
				// Handle errors appropriately, e.g., display an error message, redirect, etc.
			}
		}

		// Fetch data only if transactionToken exists to avoid unnecessary requests
		if (transactionToken) {
			fetchData()
		}

		// Cleanup function (optional, but recommended for potential side effects)
		return () => {
			// Perform any necessary cleanup, e.g., canceling subscriptions, event listeners
		}
	}, [])

	console.log(
		`TransID: ${transID}, CCDapproval: ${ccdApproval}, PnrID: ${pnrID}, TransactionToken: ${transactionToken}, CompanyRef: ${companyRef}`,
	)

	return (
		<div className="h-screen animate-pulse w-full space-y-4 flex items-center flex-col justify-center">
			<h1 className="text-xl font-bold">Processing Payment</h1>
			<Loader2
				className="animate-spin  h-16 w-16
            "
			/>
		</div>
	)
}

export default Payment
