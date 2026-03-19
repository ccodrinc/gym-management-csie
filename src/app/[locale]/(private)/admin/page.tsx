import { getTranslations } from 'next-intl/server'

import { SeedDataButton } from '@/components/admin/seed-data-button'
import { MembershipChart, WeeklyVisitsChart } from '@/components/admin/dashboard-charts'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalytics } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminDashboardPage({ params }: Props) {
	const { locale } = await params

	const [analytics, t] = await Promise.all([
		getAnalytics(locale),
		getTranslations({ locale, namespace: 'Admin.dashboard' })
	])
	const { totalMembers, activeToday, newThisMonth, avgCheckinsPerDay, visitsPerDay, membershipBreakdown } = analytics

	return (
		<FadeIn className='space-y-8'>
			<div className='flex flex-wrap items-start justify-between gap-4'>
				<PageHeader title={t('title')} description={t('description')} />
				<SeedDataButton />
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatCard title={t('totalMembers')} value={totalMembers.toLocaleString()} subtitle={t('allTime')} />
				<StatCard title={t('activeToday')} value={activeToday} subtitle={t('checkIns24h')} />
				<StatCard title={t('newThisMonth')} value={newThisMonth} subtitle={t('newMemberships')} />
				<StatCard title={t('avgCheckinsPerDay')} value={avgCheckinsPerDay} subtitle={t('sevenDayAvg')} />
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>{t('weeklyVisits')}</CardTitle>
						<CardDescription>{t('checkInsPerDay')}</CardDescription>
					</CardHeader>
					<CardContent>
						<WeeklyVisitsChart data={visitsPerDay} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t('membershipDistribution')}</CardTitle>
						<CardDescription>{t('byPlanType')}</CardDescription>
					</CardHeader>
					<CardContent>
						<MembershipChart data={membershipBreakdown} />
					</CardContent>
				</Card>
			</div>
		</FadeIn>
	)
}
