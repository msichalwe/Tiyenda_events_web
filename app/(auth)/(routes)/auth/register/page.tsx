import { UserAuthForm } from '@/app/components/user-auth-form'
import Link from 'next/link'
import Image from 'next/image'
import { RegisterForm } from '@/components/auth/register-form'

const SignUp = () => {
	return (
		<>
			<div className="md:hidden">
				<Image
					src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					width={1280}
					height={843}
					alt="Authentication"
					className="block dark:hidden"
				/>
				<Image
					src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					width={1280}
					height={843}
					alt="Authentication"
					className="hidden dark:block"
				/>
			</div>
			<div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					<Image
						src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						fill
						alt="Authentication"
						className="block dark:hidden object-cover"
					/>
				</div>
				<div className="lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<RegisterForm />
					</div>
				</div>
			</div>
		</>
	)
}

export default SignUp
