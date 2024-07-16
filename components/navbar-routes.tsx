'use client'

import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import Link from 'next/link'
import { useCurrentRole } from '@/hooks/use-current-role'

export const NavbarRoutes = () => {
	const pathname = usePathname()
	const session = useSession()
	const role = useCurrentRole()

	const userProfileImg = session?.data?.user?.image as string

	const isEventCreatorPage = pathname?.startsWith('/dashboard/creator')

	return (
		<div className="flex gap-x-2 ml-auto">
			{isEventCreatorPage ? (
				<>
					{role === 'ADMIN' && (
						<Link href="/dashboard">
							<Button size="sm" variant={'ghost'}>
								<LogOut className="h-4 w-4 mr-2" />
								Exit
							</Button>
						</Link>
					)}
				</>
			) : (
				<Link href="/dashboard/creator/events">
					<Button size="sm" variant={'ghost'}>
						Event Creator Mode
					</Button>
				</Link>
			)}

			<div>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage
								alt={session?.data?.user?.name as string}
								src={userProfileImg}
							/>
							<AvatarFallback className="text-zicta-blue font-medium">
								{session?.data?.user?.email?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => signOut()}>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
