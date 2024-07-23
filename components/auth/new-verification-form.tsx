'use client'

import { Loader2 } from 'lucide-react'
import { CardWrapper } from './card-wrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { newVerification } from '@/actions/new-verification'
import { FormSuccess } from '../form-success'
import { FormError } from '../form-error'

export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')

	const searchParams = useSearchParams()

	const token = searchParams.get('token')

	const onSubmit = useCallback(() => {
		if (success || error) return
		if (!token) {
			setError('Missing token')
			return
		}
		newVerification(token)
			.then((data) => {
				setSuccess(data?.success)
				setError(data?.error)
			})
			.catch(() => {
				setError('Oops.. Something went wrong.')
			})
	}, [token, success, error])

	useEffect(() => {
		onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper
			headerLabel="Confirm your verification"
			backButtonHref="/auth/loging"
			backButtonLabel="Back to login">
			<div className="flex items-center w-full justify-center">
				{!success && !error && <Loader2 className="animate-spin h-10 w-10" />}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	)
}
