'use server'

import { hash } from 'bcryptjs'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { getTranslations } from 'next-intl/server'
import { Prisma, Role, MembershipStatus } from '@prisma/client'
import { signIn } from '@/auth'
import { prisma } from '@/lib/db'
import { getMembershipTypeFromQuery } from '@/lib/membership'

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
		const usernameNorm = username.trim().toLowerCase()

		await signIn('credentials', {
			username: usernameNorm,
			password,
			redirect: false
		})

		const user = await prisma.user.findUnique({
			where: { username: usernameNorm },
			select: { role: true }
		})
		const defaultPath = user?.role === Role.ADMIN ? '/admin' : '/member'
		const redirectTo = isAllowedRedirect(from ?? '') ? (from ?? defaultPath) : defaultPath
		return { ok: true, redirectTo }
	} catch (err) {
		const tAuth = await getTranslations('Actions.auth')
		const tCommon = await getTranslations('Actions.common')
		if (isRedirectError(err)) throw err
		if (err instanceof AuthError) {
			return { ok: false, error: tAuth('invalidCredentials') }
		}
		if (process.env.NODE_ENV === 'development') {
			console.error('[loginAction]', err)
		}
		return { ok: false, error: tCommon('somethingWentWrong') }
	}
}

export type SignupResult =
	| { ok: true; redirectTo: string }
	| { ok: false; error: string }

export async function signupAction(
	name: string,
	username: string,
	password: string,
	selectedPlan?: string
): Promise<SignupResult> {
	try {
		const tAuth = await getTranslations('Actions.auth')
		const usernameNorm = username.trim().toLowerCase()

		if (!/^[a-z0-9_-]+$/.test(usernameNorm)) {
			return { ok: false, error: tAuth('usernameInvalid') }
		}

		const existing = await prisma.user.findUnique({
			where: { username: usernameNorm }
		})
		if (existing) {
			return { ok: false, error: tAuth('usernameTaken') }
		}

		const hashedPassword = await hash(password, 12)
		try {
			await prisma.user.create({
				data: {
					name: name.trim(),
					username: usernameNorm,
					password: hashedPassword,
					role: Role.MEMBER,
					membershipStatus: MembershipStatus.DEACTIVATED
				}
			})
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				return { ok: false, error: tAuth('usernameTaken') }
			}
			throw error
		}

		await signIn('credentials', {
			username: usernameNorm,
			password,
			redirect: false
		})

		const preferredPlan = getMembershipTypeFromQuery(selectedPlan)
		return {
			ok: true,
			redirectTo: preferredPlan
				? `/member/membership?plan=${selectedPlan}`
				: '/member/membership'
		}
	} catch (err) {
		const tAuth = await getTranslations('Actions.auth')
		const tCommon = await getTranslations('Actions.common')
		if (isRedirectError(err)) throw err
		if (err instanceof AuthError) {
			return { ok: false, error: tAuth('accountCreatedSignInFailed') }
		}
		if (process.env.NODE_ENV === 'development') {
			console.error('[signupAction]', err)
		}
		return { ok: false, error: tCommon('somethingWentWrongRetry') }
	}
}
