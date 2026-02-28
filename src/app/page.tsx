import { redirect } from 'next/navigation'

import { routing } from '@/i18n/routing'

/**
 * Root path redirects to the default locale.
 * Required because all pages live under [locale]; next-intl middleware
 * may not rewrite / before the request reaches the app.
 */
export default function RootPage() {
	redirect(`/${routing.defaultLocale}`)
}
