import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getLocalizedUrl } from '@/lib/seo'

const publicPaths = ['/', '/pricing', '/privacy', '/terms'] as const

export default function sitemap(): MetadataRoute.Sitemap {
	return routing.locales.flatMap((locale) =>
		publicPaths.map((pathname) => ({
			url: getLocalizedUrl(pathname, locale),
			lastModified: new Date(),
			changeFrequency: pathname === '/' ? 'weekly' : 'monthly',
			priority: pathname === '/' ? 1 : 0.6
		}))
	)
}
