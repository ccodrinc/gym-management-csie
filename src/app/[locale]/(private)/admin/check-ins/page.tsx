import { getTranslations } from 'next-intl/server'

import { ListRow } from '@/components/shared/list-row'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCheckIns } from '@/lib/data'
import { formatNumber } from '@/lib/format'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminCheckInsPage({ params }: Props) {
	const { locale } = await params

	const [checkIns, t] = await Promise.all([getCheckIns(), getTranslations({ locale, namespace: 'Admin.checkIns' })])

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('todayCheckIns')}</CardTitle>
					<CardDescription>
						{t('todayCheckInsSummary', { count: formatNumber(checkIns.length, locale) })}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className='flex flex-col gap-2'>
						{checkIns.map((c) => (
							<ListRow key={c.id}>
								<span>{c.memberName}</span>
								<span className='text-muted-foreground'>{c.time}</span>
							</ListRow>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
