import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { MemberActivityChart } from '@/components/admin/dashboard-charts'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { ListRow } from '@/components/ui/list-row'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentMember } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberDashboardPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const [member, t] = await Promise.all([
		getCurrentMember(),
		getTranslations('Member.dashboard')
	])
	const visitsData = member.visitsLast7Days ?? [
		{ day: 'Mon', count: 0 },
		{ day: 'Tue', count: 0 },
		{ day: 'Wed', count: 1 },
		{ day: 'Thu', count: 0 },
		{ day: 'Fri', count: 1 },
		{ day: 'Sat', count: 1 },
		{ day: 'Sun', count: 1 }
	]

	return (
		<FadeIn className='space-y-8'>
			<PageHeader
				title={t('welcomeBack', { name: member.name?.split(' ')[0] ?? 'Member' })}
				description={t('activityAtGlance')}
			/>

			<div className='grid gap-4 md:grid-cols-3'>
				<StatCard
					title={t('membership')}
					value={member.membershipType}
					subtitle={t('validUntil', { date: member.expiryDate ?? '—' })}
					badge={<Badge variant={member.isActive ? 'default' : 'secondary'}>{member.isActive ? 'Active' : 'Expired'}</Badge>}
				/>
				<StatCard
					title={t('gymVisits')}
					value={member.gymVisits}
					subtitle={t('totalThisPeriod')}
				/>
				<StatCard
					title={t('upcomingClasses')}
					value={member.upcomingClasses.length}
					subtitle={t('bookedThisWeek')}
				/>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>{t('activityChart')}</CardTitle>
						<CardDescription>{t('visitsThisWeek')}</CardDescription>
					</CardHeader>
					<CardContent>
						<MemberActivityChart data={visitsData} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t('recentVisits')}</CardTitle>
						<CardDescription>{t('lastFive')}</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='space-y-2'>
							{member.recentVisits.map((visit) => (
								<ListRow key={`${visit.date}-${visit.time}`}>
									<span>{visit.date}</span>
									<span className='text-muted-foreground'>{visit.time}</span>
								</ListRow>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>{t('upcomingClasses')}</CardTitle>
						<CardDescription>{t('yourBookedSessions')}</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='space-y-2'>
							{member.upcomingClasses.map((cls) => (
								<ListRow key={`${cls.name}-${cls.date}-${cls.time}`}>
									<div>
										<span className='font-medium'>{cls.name}</span>
										<span className='text-muted-foreground ml-2'>{cls.date}</span>
									</div>
									<span className='text-muted-foreground'>{cls.time}</span>
								</ListRow>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</FadeIn>
	)
}
