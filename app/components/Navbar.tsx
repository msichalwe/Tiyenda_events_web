'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { MenuItem } from './menu-item'
import { useRouter } from 'next/navigation'

const Navbar = () => {
	const session = useSession()
	const userProfileImg = session?.data?.user?.image as string
	const router = useRouter()

	return (
		<div className="border-b fixed bg-white w-full z-[100]">
			<div className="flex h-16 items-center w-5/6 mx-auto ">
				<div className="mx-auto sm:mx-10">
					<Link href="/">
						<Image src="/assets/logo.png" alt="logo" width={40} height={20} />
					</Link>
				</div>
				<div className="ml-auto flex items-center justify-center ">
					{session.status === 'authenticated' && (
						<Link
							className="pr-20 font-semibold text-sm"
							href="/dashboard/creator/create">
							Create Event
						</Link>
					)}
					{session.status === 'authenticated' && (
						<Link className="pr-20 font-semibold text-sm" href="/tickets">
							My Tickets
						</Link>
					)}
					<p className="pr-2 text-sm font-semibold font-mono">
						{session?.data?.user?.email}
					</p>
					<div>
						{session.status === 'authenticated' ? (
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
									<MenuItem
										onClick={() => router.push('/settings')}
										label="Profile"
									/>
									<MenuItem onClick={() => signOut()} label="Logout" />
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link href="/auth/login">
								<p className="text-sm font-semibold ">Sign In / Sign Up</p>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Navbar
