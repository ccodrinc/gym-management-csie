import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale()

	return (
		<html
			lang={locale}
			suppressHydrationWarning
		>
			<body className={`${bricolage.variable} ${jetbrains.variable} antialiased`}>
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
