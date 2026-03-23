import { getTranslations } from 'next-intl/server'

import { ListRow } from '@/components/shared/list-row'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentMember } from '@/lib/data'
import { formatDate } from '@/lib/format'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberVisitsPage({ params }: Props) {
	const { locale } = await params

	const [member, t] = await Promise.all([
		getCurrentMember(locale),
		getTranslations({ locale, namespace: 'Member.visits' })
	])
	const visits = member.visitHistory ?? member.recentVisits

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('visitHistory')}</CardTitle>
					<CardDescription>{t('totalCheckIns', { count: visits.length })}</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className='flex flex-col gap-2'>
						{visits.map((visit) => (
							<ListRow key={`${visit.date}-${visit.time}`}>
								<span>{formatDate(visit.date, locale)}</span>
								<span className='text-muted-foreground'>{visit.time}</span>
							</ListRow>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
