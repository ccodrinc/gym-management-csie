import type { MetadataRoute } from 'next'

import { BRAND_PRIMARY_HEX, SITE_NAME, SITE_TAGLINE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: SITE_NAME,
		description: SITE_TAGLINE,
		start_url: '/en',
		display: 'standalone',
		background_color: '#121514',
		theme_color: BRAND_PRIMARY_HEX,
		icons: [
			{
				src: '/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			},
			{
				src: '/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png'
			}
		]
	}
}
