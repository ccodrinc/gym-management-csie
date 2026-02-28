import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { AUTH_COOKIE, isDemoMode } from './src/lib/auth'
import { routing } from './src/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function isPrivatePath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?(member|admin)(\/|$)/.test(pathname)
}

export default function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	if (!isDemoMode && isPrivatePath(pathname)) {
		const hasAuth = request.cookies.get(AUTH_COOKIE)?.value === '1'
		if (!hasAuth) {
			const loginUrl = new URL('/login', request.url)
			loginUrl.searchParams.set('from', pathname)
			return NextResponse.redirect(loginUrl)
		}
	}

	return intlMiddleware(request)
}

export const config = {
	matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
}
