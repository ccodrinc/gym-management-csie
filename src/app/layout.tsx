import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import { getLocale } from 'next-intl/server'

import { ThemeProvider } from '@/components/shared/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import { BRAND_PRIMARY_HEX, BUSINESS_FIELD, getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/site'
import './globals.css'

const bricolage = Bricolage_Grotesque({
	variable: '--font-display',
	subsets: ['latin']
})

const jetbrains = JetBrains_Mono({
	variable: '--font-jetbrains',
	subsets: ['latin']
})

export const metadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	applicationName: SITE_NAME,
	title: {
		default: SITE_TITLE,
		template: `%s | ${SITE_NAME}`
	},
	description: SITE_DESCRIPTION,
	category: BUSINESS_FIELD,
	manifest: '/manifest.webmanifest',
	icons: {
		icon: [
			{ url: '/favicon.ico' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
		shortcut: ['/favicon.ico']
	}
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	colorScheme: 'dark light',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: BRAND_PRIMARY_HEX },
		{ media: '(prefers-color-scheme: dark)', color: BRAND_PRIMARY_HEX }
	]
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const cookieStore = await cookies()
	const localeCookie = cookieStore.get('NEXT_LOCALE')?.value
	const locale = routing.locales.includes(localeCookie as (typeof routing.locales)[number])
		? localeCookie
		: await getLocale()

	return (
		<html
			lang={locale}
			className='dark'
			suppressHydrationWarning
		>
			<body className={`${bricolage.variable} ${jetbrains.variable} antialiased`}>
				<a
					href='#main-content'
					className='skip-link'
				>
					Skip to content
				</a>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
