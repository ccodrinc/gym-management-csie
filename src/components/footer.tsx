import { getTranslations } from 'next-intl/server'

import { FooterNavGitHubLink, FooterNavLink } from '@/components/footer-nav'

const GITHUB_REPO_URL = 'https://github.com/ccodrinc/gym-management-csie'

export async function Footer({ locale }: { locale: string }) {
	const t = await getTranslations({ locale, namespace: 'Footer' })

	return (
		<footer className='border-border mt-auto w-full border-t py-8'>
			<div className='mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-muted-foreground text-sm'>
					{t('copyright')} · {t('madeBy')}{' '}
					<FooterNavGitHubLink href={GITHUB_REPO_URL}>Codrin Caraba</FooterNavGitHubLink>
				</p>
				<nav className='flex gap-6'>
					<FooterNavLink href='/privacy'>{t('privacy')}</FooterNavLink>
					<FooterNavLink href='/terms'>{t('terms')}</FooterNavLink>
				</nav>
			</div>
		</footer>
	)
}
