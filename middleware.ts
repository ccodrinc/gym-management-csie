import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { isDemoMode } from '@/lib/auth'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function isPrivatePath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?(member|admin)(\/|$)/.test(pathname)
}

function isAdminPath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?admin(\/|$)/.test(pathname)
}

function getLocale(pathname: string): string {
	const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
	return match ? match[1] : routing.defaultLocale
}

export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl

	if (!isDemoMode && isPrivatePath(pathname)) {
		const token = await getToken({
			req,
			secret: process.env.AUTH_SECRET
		})

		if (!token) {
			const locale = getLocale(pathname)
			const loginUrl = new URL(`/${locale}/login`, req.url)
			loginUrl.searchParams.set('from', pathname)
			return NextResponse.redirect(loginUrl)
		}
		if (isAdminPath(pathname) && token.role !== 'ADMIN') {
			const locale = getLocale(pathname)
			return NextResponse.redirect(new URL(`/${locale}/member`, req.url))
		}
	}

	return intlMiddleware(req)
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
