export const SITE_NAME = 'Reps'
export const SITE_TITLE = 'Reps Gym Management'
export const SITE_DESCRIPTION =
	'Bilingual gym management platform for a 24/7 fitness club, with marketing pages, member self-service flows, and admin operations.'
export const SITE_TAGLINE = '24/7 Downtown Gym'
export const BUSINESS_FIELD = 'Fitness & gym management'
export const BRAND_PRIMARY_HEX = '#3f8755'
export const SITE_LOCALE_REGION = {
	en: 'en_US',
	ro: 'ro_RO'
} as const

export function getSiteUrl() {
	const envUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.NEXT_PUBLIC_SITE_URL ||
		process.env.VERCEL_PROJECT_PRODUCTION_URL ||
		process.env.VERCEL_URL

	if (!envUrl) {
		return 'http://localhost:3000'
	}

	return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`
}
