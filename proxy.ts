import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function isPrivatePath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?(member|trainer|admin)(\/|$)/.test(pathname)
}

function isAdminPath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?admin(\/|$)/.test(pathname)
}

function isMemberPath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?member(\/|$)/.test(pathname)
}

function isTrainerPath(pathname: string): boolean {
	return /^\/([a-z]{2}\/)?trainer(\/|$)/.test(pathname)
}

function getRoleHome(role: unknown, locale: string): string {
	if (role === 'ADMIN') return `/${locale}/admin`
	if (role === 'TRAINER') return `/${locale}/trainer/classes`
	return `/${locale}/member`
}

function getLocale(pathname: string): string {
	const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
	return match ? match[1] : routing.defaultLocale
}

export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl

	if (isPrivatePath(pathname)) {
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
		const locale = getLocale(pathname)
		if (isAdminPath(pathname) && token.role !== 'ADMIN') {
			return NextResponse.redirect(new URL(getRoleHome(token.role, locale), req.url))
		}
		if (isTrainerPath(pathname) && token.role !== 'TRAINER') {
			return NextResponse.redirect(new URL(getRoleHome(token.role, locale), req.url))
		}
		if (isMemberPath(pathname) && token.role !== 'MEMBER') {
			return NextResponse.redirect(new URL(getRoleHome(token.role, locale), req.url))
		}
	}

	return intlMiddleware(req)
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
