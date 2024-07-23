import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { getUserById } from './data/user'
import { CompanyRole, UserRole } from '@prisma/client'
import { getTwoFactorConfirmationByUserID } from './data/two-factor-confirmation'

declare module 'next-auth' {
	interface Session {
		user: {
			role: UserRole
			organizerRole: CompanyRole | null
			organizerId: string | null
			phoneNumber: string | null
			city: string | null
			country: string | null
			address: string | null
			isTwoFactorEnabled: boolean
		} & DefaultSession['user']
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: {
					emailVerified: new Date(),
				},
			})
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			//Allow OAuth without email verification
			if (account?.provider !== 'credentials') {
				return true
			}

			const existingUser = await getUserById(user.id!)

			if (!existingUser?.emailVerified) return false

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserID(
					existingUser.id,
				)

				console.log({ twoFactorConfirmation })

				if (!twoFactorConfirmation) return false

				//Delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				})
			}

			return true
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole
				session.user.organizerRole = token.organizerRole as CompanyRole
				session.user.organizerId = token.organizerId as string | null
			}
			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
				session.user.phoneNumber = token.phoneNumber as string
				session.user.address = token.address as string
				session.user.city = token.city as string
				session.user.country = token.country as string
			}

			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token
			const existingUser = await getUserById(token.sub)

			if (!existingUser) return token

			token.role = existingUser.role
			token.organizerRole = existingUser.organizerRole
			token.organizerId = existingUser.organizerId
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
			token.phoneNumber = existingUser.phoneNumber
			;(token.city = existingUser.city),
				(token.country = existingUser.country),
				(token.address = existingUser.address)
			return token
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
})
