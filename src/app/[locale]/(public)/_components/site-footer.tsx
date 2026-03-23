import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

const GITHUB_REPO_URL = 'https://github.com/ccodrinc/gym-management-csie'

type SiteFooterProps = {
	locale: string
}

export async function SiteFooter({ locale }: SiteFooterProps) {
	const t = await getTranslations({ locale, namespace: 'Footer' })

	return (
		<footer className='border-border mt-auto w-full border-t py-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-muted-foreground text-sm leading-6'>
					{t('copyright')} · {t('madeBy')}{' '}
					<a
						href={GITHUB_REPO_URL}
						target='_blank'
						rel='noreferrer'
						className='text-primary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center rounded-sm transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
					>
						Codrin Caraba
					</a>
				</p>
				<nav
					aria-label={t('privacy')}
					className='flex flex-wrap items-center gap-6'
				>
					<Link
						href='/privacy'
						locale={locale}
						className='text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
					>
						{t('privacy')}
					</Link>
					<Link
						href='/terms'
						locale={locale}
						className='text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
					>
						{t('terms')}
					</Link>
				</nav>
			</div>
		</footer>
	)
}
