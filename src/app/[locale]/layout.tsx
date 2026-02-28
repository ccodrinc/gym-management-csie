import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/footer'
import { routing } from '@/i18n/routing'

type Props = {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params

	if (!hasLocale(routing.locales, locale)) {
		return {}
	}

	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return {
		title: t('title'),
		description: t('description')
	}
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	setRequestLocale(locale)

	const messages = await getMessages()

	return (
		<NextIntlClientProvider messages={messages}>
			<div className='flex min-h-screen flex-col'>
				<main className='flex-1'>{children}</main>
				<Footer />
			</div>
		</NextIntlClientProvider>
	)
}
