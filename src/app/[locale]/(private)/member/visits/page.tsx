import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/ui/page-header'
import { ListRow } from '@/components/ui/list-row'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentMember } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberVisitsPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const [member, t] = await Promise.all([
		getCurrentMember(),
		getTranslations('Member.visits')
	])
	const visits = member.visitHistory ?? member.recentVisits

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<Card>
				<CardHeader>
					<CardTitle>{t('visitHistory')}</CardTitle>
					<CardDescription>
						{visits.length} total check-ins
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className='space-y-2'>
						{visits.map((visit) => (
							<ListRow key={`${visit.date}-${visit.time}`}>
								<span>{visit.date}</span>
								<span className='text-muted-foreground'>{visit.time}</span>
							</ListRow>
						))}
					</ul>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
