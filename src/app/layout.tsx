import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
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
	title: 'Reps',
	description: '24/7 gym downtown. Full weights, turf, group classes.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang='en'
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
				</ThemeProvider>
			</body>
		</html>
	)
}
