'use client'

import verifyToken from '@/actions/payments'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { toast } from 'sonner'

interface VerifyButtonProps {
	transactionToken: string
	companyRef: string
}

const VerifyButton = ({ transactionToken, companyRef }: VerifyButtonProps) => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const onVerifyPayment = async () => {
		startTransition(() => {
			verifyToken({
				transactionToken,
				companyRef,
			})
				.then((data) => {
					if (data?.error) {
						console.error(data?.error)
						toast.error(data?.error)
						if (data?.url) {
							router.push(data?.url!)
						}
					}
					if (data?.success) {
						console.log(data?.success)
						toast.success(data?.success)
						router.refresh()
					}
				})
				.catch((error) => {
					console.error('Error verifying payment:', error)
					toast.error('Oops something went wrong.. Retry')
				})
			router.refresh()
		})
	}
	return (
		<Button variant={'outline'} onClick={onVerifyPayment}>
			{isPending ? (
				<span className="flex items-center">
					Verfiying <Loader2 className="ml-2 animate-spin" />
				</span>
			) : (
				'Verify Payment'
			)}
		</Button>
	)
}

export default VerifyButton
