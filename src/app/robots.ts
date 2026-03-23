import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/admin',
				'/member',
				'/login',
				'/signup',
				'/en/admin',
				'/en/member',
				'/en/login',
				'/en/signup',
				'/ro/admin',
				'/ro/member',
				'/ro/login',
				'/ro/signup'
			]
		},
		sitemap: `${getSiteUrl()}/sitemap.xml`
	}
}
