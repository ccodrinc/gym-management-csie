'use server'

import { hash } from 'bcryptjs'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { Prisma, Role } from '@prisma/client'
import { signIn } from '@/auth'
import { prisma } from '@/lib/db'

const ALLOWED_REDIRECT_PATTERNS = [
	/^\/member(\/|$)/,
	/^\/admin(\/|$)/,
	/^\/[a-z]{2}\/member(\/|$)/,
	/^\/[a-z]{2}\/admin(\/|$)/
]

function isAllowedRedirect(path: string): boolean {
	if (!path || path.includes('//') || path.startsWith('//')) return false
	return ALLOWED_REDIRECT_PATTERNS.some((re) => re.test(path))
}

export type LoginResult = { ok: true; redirectTo: string } | { ok: false; error: string }

export async function loginAction(
	username: string,
	password: string,
	from?: string
): Promise<LoginResult> {
	try {
		await signIn('credentials', {
			username: username.trim().toLowerCase(),
			password,
			redirect: false
		})

		const redirectTo = isAllowedRedirect(from ?? '') ? (from ?? '/member') : '/member'
		return { ok: true, redirectTo }
	} catch (err) {
		if (isRedirectError(err)) throw err
		if (err instanceof AuthError) {
			return { ok: false, error: 'Invalid username or password' }
		}
		if (process.env.NODE_ENV === 'development') {
			console.error('[loginAction]', err)
		}
		return { ok: false, error: 'Something went wrong' }
	}
}

export type SignupResult =
	| { ok: true; redirectTo: string }
	| { ok: false; error: string }

export async function signupAction(
	name: string,
	username: string,
	password: string
): Promise<SignupResult> {
	try {
		const usernameNorm = username.trim().toLowerCase()

		if (!/^[a-z0-9_-]+$/.test(usernameNorm)) {
			return { ok: false, error: 'Username can only contain letters, numbers, underscores and hyphens' }
		}

		const existing = await prisma.user.findUnique({
			where: { username: usernameNorm }
		})
		if (existing) {
			return { ok: false, error: 'This username is already taken' }
		}

		const hashedPassword = await hash(password, 12)
		try {
			await prisma.user.create({
				data: {
					name: name.trim(),
					username: usernameNorm,
					password: hashedPassword,
					role: Role.MEMBER
				}
			})
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				return { ok: false, error: 'This username is already taken' }
			}
			throw error
		}

		await signIn('credentials', {
			username: usernameNorm,
			password,
			redirect: false
		})

		return { ok: true, redirectTo: '/member' }
	} catch (err) {
		if (isRedirectError(err)) throw err
		if (err instanceof AuthError) {
			return { ok: false, error: 'Account created but sign in failed. Please try logging in.' }
		}
		if (process.env.NODE_ENV === 'development') {
			console.error('[signupAction]', err)
		}
		return { ok: false, error: 'Something went wrong. Please try again.' }
	}
}
