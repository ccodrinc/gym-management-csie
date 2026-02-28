import { Dumbbell } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

import { LoginForm } from '@/components/auth/login-form'
import { FadeIn, LogoLink } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: Props) {
	const { locale } = await params
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
			<LoginForm />
		</FadeIn>
	)
}
