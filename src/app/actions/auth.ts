'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { AUTH_COOKIE } from '@/lib/auth'

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

export async function demoLogin(from?: string) {
	;(await cookies()).set(AUTH_COOKIE, '1', {
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	})
	redirect(isAllowedRedirect(from ?? '') ? from! : '/member')
}
