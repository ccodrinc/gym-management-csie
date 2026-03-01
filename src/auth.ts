import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'

import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'

declare module 'next-auth' {
	interface User {
		role?: Role
	}

	interface Session {
		user: {
			id: string
			username?: string | null
			name?: string | null
			image?: string | null
			role: Role
		}
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		role?: Role
		sub: string
	}
}

const authSecret =
	process.env.AUTH_SECRET ||
	(process.env.NODE_ENV === 'development' ? 'dev-secret-min-32-chars-for-local' : undefined)

if (!authSecret) {
	throw new Error(
		'AUTH_SECRET is required. Add it to .env or run: npx auth secret'
	)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: authSecret,
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	pages: {
		signIn: '/login'
	},
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null
				const username = String(credentials.username).trim().toLowerCase()
				const password = String(credentials.password)

				const user = await prisma.user.findUnique({
					where: { username }
				})
				if (!user || !user.password) return null

				const ok = await compare(password, user.password)
				if (!ok) return null

				return {
					id: user.id,
					username: user.username,
					name: user.name ?? undefined,
					image: user.image ?? undefined,
					role: user.role
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id
				token.role = user.role
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? ''
				session.user.role =
					token.role === Role.ADMIN || token.role === Role.MEMBER ? token.role : Role.MEMBER
			}
			return session
		}
	}
})
