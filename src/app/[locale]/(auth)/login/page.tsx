import { Dumbbell } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

import { LoginForm } from '@/components/auth/login-form'
import { Link } from '@/i18n/navigation'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'>
			<Link
				href='/'
				className='text-primary flex items-center gap-2 font-semibold tracking-tight'
			>
				<Dumbbell
					className='size-5'
					strokeWidth={2}
				/>
				Reps
			</Link>
			<LoginForm />
		</div>
	)
}
