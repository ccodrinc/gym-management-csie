import { getTranslations } from 'next-intl/server'

import { SignupForm } from '@/components/auth/signup-form'
import { BrandMark } from '@/components/brand-mark'
import { FadeIn, LogoLink } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ plan?: string }>
}

export default async function SignupPage({ params, searchParams }: Props) {
	const { locale } = await params
	const { plan } = await searchParams
	const t = await getTranslations({ locale, namespace: 'Header' })
	const tPricing = await getTranslations({ locale, namespace: 'Pricing' })
	const planLabels: Record<string, string> = {
		dayPass: tPricing('dayPass.name'),
		monthly: tPricing('monthly.name'),
		annual: tPricing('annual.name')
	}

	return (
		<FadeIn className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'>
			<LogoLink href='/'>
				<BrandMark priority />
				{t('brand')}
			</LogoLink>
			<SignupForm
				selectedPlanLabel={plan ? (planLabels[plan] ?? plan) : undefined}
				selectedPlanValue={plan}
			/>
		</FadeIn>
	)
}
