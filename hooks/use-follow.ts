import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { toast } from 'react-hot-toast'

interface IUseFollow {
	organizerId: string
	currentUser?: User | null
}

const useFollow = ({ organizerId, currentUser }: IUseFollow) => {
	const router = useRouter()
	const session = useSession()

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

			try {
				let request

				if (hasFollowed) {
					request = () => axios.delete(`/api/follow/${organizerId}`)
				} else {
					request = () =>
						axios.post(`/api/follow/${organizerId}`, { userId: currentUser.id })
				}

				await request()
				router.refresh()
				toast.success('Success')
			} catch (error) {
				toast.error('Error')
			}
		},
		[currentUser, hasFollowed, organizerId, router],
	)

	return {
		hasFollowed,
		toggleFollow,
	}
}

export default useFollow
