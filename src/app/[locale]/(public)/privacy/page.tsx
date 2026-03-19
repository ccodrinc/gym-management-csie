import { getTranslations } from 'next-intl/server'

import { LegalPageShell } from '@/components/legal/legal-page-shell'

type Props = {
	params: Promise<{ locale: string }>
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
