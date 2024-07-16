'use client'

import useFollow from '@/hooks/use-follow'
import { User } from '@prisma/client'

interface FollowButtonProps {
	organizerId: string
	currentUser: any
}

const FollowButton: React.FC<FollowButtonProps> = ({
	organizerId,
	currentUser,
}) => {
	const { hasFollowed, toggleFollow } = useFollow({ organizerId, currentUser })

	return (
		<div
			onClick={toggleFollow}
			className={
				!hasFollowed
					? 'focus:outline-none cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
					: 'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
			}>
			{hasFollowed ? 'Unfollow' : 'Follow'}
		</div>
	)
}

export default FollowButton
