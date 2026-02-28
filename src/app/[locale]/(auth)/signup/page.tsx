import { Dumbbell } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

import { SignupForm } from '@/components/auth/signup-form'
import { FadeIn, LogoLink } from '@/components/motion'

const planLabels: Record<string, string> = {
	dayPass: 'Day pass',
	monthly: 'Monthly',
	annual: 'Annual'
}

type Props = {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ plan?: string }>
}

export default async function SignupPage({ params, searchParams }: Props) {
	const { locale } = await params
	const { plan } = await searchParams
	setRequestLocale(locale)

	return (
		<FadeIn className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'>
			<LogoLink href='/'>
				<Dumbbell
					className='size-5'
					strokeWidth={2}
				/>
				Reps
			</LogoLink>
			<SignupForm selectedPlan={plan ? (planLabels[plan] ?? plan) : undefined} />
		</FadeIn>
	)
}
