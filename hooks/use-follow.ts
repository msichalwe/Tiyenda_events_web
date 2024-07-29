import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

interface IUseFollow {
	organizerId: string
	currentUser?: User | null
}

const useFollow = ({ organizerId, currentUser }: IUseFollow) => {
	const router = useRouter()
	const session = useSession()
	const [isLoading, setIsLoading] = useState(false)

	const hasFollowed = useMemo(() => {
		const list = currentUser?.followedIds || []

		return list.includes(organizerId)
	}, [currentUser, organizerId])

	const toggleFollow = useCallback(
		async (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()

			if (!currentUser) {
				return router.push('/auth/login')
			}

			setIsLoading(true)

			try {
				let request

				if (hasFollowed) {
					request = () => axios.patch(`/api/follow/${organizerId}`, { userId: currentUser.id })
				} else {
					request = () =>
						axios.post(`/api/follow/${organizerId}`, { userId: currentUser.id })
				}

				await request()
				router.refresh()
				toast.success('Success')
			} catch (error) {
				toast.error('Error')
			} finally {
				setIsLoading(false)
			}
		},
		[currentUser, hasFollowed, organizerId, router],
	)

	return {
		hasFollowed,
		toggleFollow,
		isLoading,
	}
}

export default useFollow
