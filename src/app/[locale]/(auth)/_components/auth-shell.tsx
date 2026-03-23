import { getTranslations } from 'next-intl/server'

import { BrandMark } from '@/components/shared/brand-mark'
import { Link } from '@/i18n/navigation'

type AuthShellProps = {
	locale: string
	children: React.ReactNode
}

export async function AuthShell({ locale, children }: AuthShellProps) {
	const t = await getTranslations({ locale, namespace: 'Header' })

	return (
		<main
			id='main-content'
			className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'
		>
			<Link
				href='/'
				locale={locale}
				className='text-primary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2 font-semibold tracking-tight transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
			>
				<BrandMark priority />
				{t('brand')}
			</Link>
			{children}
		</main>
	)
}
