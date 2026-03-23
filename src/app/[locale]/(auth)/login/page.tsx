import { getTranslations } from 'next-intl/server'

import { AuthShell } from '@/app/[locale]/(auth)/_components/auth-shell'
import { LoginForm } from '@/app/[locale]/(auth)/_components/login-form'
import { createPageMetadata } from '@/lib/seo'

type Props = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Auth.login' })

	return createPageMetadata({
		locale,
		pathname: '/login',
		title: t('title'),
		description: t('subtitle'),
		noIndex: true
	})
}

export default async function LoginPage({ params }: Props) {
	const { locale } = await params

	return (
		<AuthShell locale={locale}>
			<LoginForm />
		</AuthShell>
	)
}
