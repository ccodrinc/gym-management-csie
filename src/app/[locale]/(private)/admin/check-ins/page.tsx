import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { PeakHoursChart } from '@/components/admin/dashboard-charts'
import { PageHeader } from '@/components/ui/page-header'
import { ListRow } from '@/components/ui/list-row'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCheckIns, getPeakHours } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminCheckInsPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const [checkIns, peakHours, t] = await Promise.all([
		getCheckIns(),
		getPeakHours(),
		getTranslations('Admin.checkIns')
	])

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<div className='grid gap-6 lg:grid-cols-2'>
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

				<Card>
					<CardHeader>
						<CardTitle>{t('peakHours')}</CardTitle>
						<CardDescription>Check-ins by hour (last 7 days)</CardDescription>
					</CardHeader>
					<CardContent>
						<PeakHoursChart data={peakHours} />
					</CardContent>
				</Card>
			</div>
		</FadeIn>
	)
}
