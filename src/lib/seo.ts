import type { Metadata } from 'next'

import { routing } from '@/i18n/routing'
import { getSiteUrl, SITE_LOCALE_REGION, SITE_NAME } from '@/lib/site'

type PageMetadataInput = {
	locale: string
	pathname: string
	title: string
	description: string
	noIndex?: boolean
}

function normalizePath(pathname: string) {
	if (!pathname.startsWith('/')) {
		return `/${pathname}`
	}

	return pathname
}

export function getLocalizedPath(pathname: string, locale: string) {
	const normalizedPath = normalizePath(pathname)

	if (normalizedPath === '/') {
		return `/${locale}`
	}

	return `/${locale}${normalizedPath}`
}

export function getLocalizedUrl(pathname: string, locale: string) {
	return new URL(getLocalizedPath(pathname, locale), getSiteUrl()).toString()
}

export function createPageMetadata({
	locale,
	pathname,
	title,
	description,
	noIndex = false
}: PageMetadataInput): Metadata {
	const canonical = getLocalizedUrl(pathname, locale)
	const alternates = Object.fromEntries(
		routing.locales.map((currentLocale) => [currentLocale, getLocalizedUrl(pathname, currentLocale)])
	)
	const socialImage = new URL('/opengraph-image', getSiteUrl()).toString()
	const regionLocale = SITE_LOCALE_REGION[locale as keyof typeof SITE_LOCALE_REGION] ?? SITE_LOCALE_REGION.en

	return {
		title,
		description,
		alternates: {
			canonical,
			languages: {
				...alternates,
				'x-default': getLocalizedUrl(pathname, routing.defaultLocale)
			}
		},
		openGraph: {
			type: 'website',
			locale: regionLocale,
			url: canonical,
			siteName: SITE_NAME,
			title,
			description,
			images: [
				{
					url: socialImage,
					width: 1200,
					height: 630,
					alt: title
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [socialImage]
		},
		robots: noIndex
			? {
					index: false,
					follow: false
				}
			: undefined
	}
}
