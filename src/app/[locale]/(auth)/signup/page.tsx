import { getTranslations } from 'next-intl/server'

import { AuthShell } from '@/app/[locale]/(auth)/_components/auth-shell'
import { SignupForm } from '@/app/[locale]/(auth)/_components/signup-form'
import { createPageMetadata } from '@/lib/seo'

type Props = {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ plan?: string }>
}

export default async function SignupPage({ params, searchParams }: Props) {
	const { locale } = await params
	const { plan } = await searchParams
	const tPricing = await getTranslations({ locale, namespace: 'Pricing' })
	const planLabels: Record<string, string> = {
		dayPass: tPricing('dayPass.name'),
		monthly: tPricing('monthly.name'),
		annual: tPricing('annual.name')
	}

	return (
		<AuthShell locale={locale}>
			<SignupForm
				selectedPlanLabel={plan ? (planLabels[plan] ?? plan) : undefined}
				selectedPlanValue={plan}
			/>
		</AuthShell>
	)
}

export async function generateMetadata({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Auth.signup' })

	return createPageMetadata({
		locale,
		pathname: '/signup',
		title: t('title'),
		description: t('subtitle'),
		noIndex: true
	})
}
