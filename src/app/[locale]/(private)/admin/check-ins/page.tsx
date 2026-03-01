import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/ui/page-header'
import { ListRow } from '@/components/ui/list-row'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCheckIns } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminCheckInsPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const [checkIns, t] = await Promise.all([
		getCheckIns(),
		getTranslations('Admin.checkIns')
	])

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<Card>
				<CardHeader>
					<CardTitle>{t('todayCheckIns')}</CardTitle>
					<CardDescription>
						{checkIns.length} {t('checkIns')} today
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className='space-y-2'>
						{checkIns.map((c) => (
							<ListRow key={c.id}>
								<span>{c.memberName}</span>
								<span className='text-muted-foreground'>{c.time}</span>
							</ListRow>
						))}
					</ul>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
