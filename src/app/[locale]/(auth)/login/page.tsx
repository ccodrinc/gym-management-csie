import { getTranslations } from 'next-intl/server'

import { LoginForm } from '@/components/auth/login-form'
import { BrandMark } from '@/components/brand-mark'
import { FadeIn, LogoLink } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Header' })

	return (
		<FadeIn className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'>
			<LogoLink href='/'>
				<BrandMark priority />
				{t('brand')}
			</LogoLink>
			<LoginForm />
		</FadeIn>
	)
}
