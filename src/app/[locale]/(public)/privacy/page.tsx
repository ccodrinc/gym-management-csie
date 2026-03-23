import { getTranslations } from 'next-intl/server'

import { LegalPageShell } from '@/app/[locale]/(public)/_components/legal-page-shell'
import { createPageMetadata } from '@/lib/seo'

type Props = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Legal.privacy' })

	return createPageMetadata({
		locale,
		pathname: '/privacy',
		title: t('title'),
		description: t('description')
	})
}

export default async function PrivacyPage({ params }: Props) {
	const { locale } = await params

	const t = await getTranslations({ locale, namespace: 'Legal.privacy' })

	return (
		<LegalPageShell
			variant='privacy'
			title={t('title')}
			description={t('description')}
			disclaimer={t('disclaimer')}
			summaryTitle={t('summaryTitle')}
			summaryBody={t('summaryBody')}
			sections={t.raw('sections')}
		/>
	)
}
