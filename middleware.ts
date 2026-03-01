import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { auth } from '@/auth'
import { isDemoMode } from '@/lib/auth'
import { routing } from '@/i18n/routing'
import { Role } from '@prisma/client'

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

export default auth((req) => {
	const pathname = req.nextUrl.pathname

	if (!isDemoMode && isPrivatePath(pathname)) {
		if (!req.auth) {
			const locale = getLocale(pathname)
			const loginUrl = new URL(`/${locale}/login`, req.url)
			loginUrl.searchParams.set('from', pathname)
			return NextResponse.redirect(loginUrl)
		}
		if (isAdminPath(pathname) && req.auth.user?.role !== Role.ADMIN) {
			const locale = getLocale(pathname)
			return NextResponse.redirect(new URL(`/${locale}/member`, req.url))
		}
	}

	return intlMiddleware(req)
})

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
