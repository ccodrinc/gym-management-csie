import { getTranslations } from 'next-intl/server'

const GITHUB_REPO_URL = 'https://github.com/ccodrinc/gym-management-csie'

export async function Footer() {
	const t = await getTranslations('Footer')

	return (
		<footer className='border-border mt-auto w-full border-t py-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-muted-foreground text-sm'>
					{t('copyright')} · {t('madeBy')}{' '}
					<a
						href={GITHUB_REPO_URL}
						target='_blank'
						rel='noopener noreferrer'
						className='text-primary hover:underline'
					>
						Codrin Caraba
					</a>
				</p>
				<nav className='flex gap-6'>
					<a
						href='#'
						className='text-muted-foreground hover:text-foreground text-sm transition-colors'
					>
						{t('privacy')}
					</a>
					<a
						href='#'
						className='text-muted-foreground hover:text-foreground text-sm transition-colors'
					>
						{t('terms')}
					</a>
				</nav>
			</div>
		</footer>
	)
}
