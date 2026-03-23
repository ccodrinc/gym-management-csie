import { getTranslations } from 'next-intl/server'

import { MemberActivityChart } from '@/app/[locale]/(private)/_components/charts'
import { ListRow } from '@/components/shared/list-row'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentMember } from '@/lib/data'
import { formatDate, formatNumber } from '@/lib/format'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberDashboardPage({ params }: Props) {
	const { locale } = await params

	const [member, t] = await Promise.all([
		getCurrentMember(locale),
		getTranslations({ locale, namespace: 'Member.dashboard' })
	])
	const visitsData = member.visitsThisWeek

	return (
		<div className='flex flex-col gap-8'>
			<PageHeader
				title={t('welcomeBack', { name: member.name?.split(' ')[0] ?? 'Member' })}
				description={t('activityAtGlance')}
			/>

			<div className='grid gap-4 md:grid-cols-3'>
				<StatCard
					title={t('membership')}
					value={member.membershipType}
					subtitle={t('validUntil', { date: member.expiryDate ?? '—' })}
					badge={<Badge variant={member.isActive ? 'default' : 'secondary'}>{member.membershipStatus}</Badge>}
				/>
				<StatCard
					title={t('gymVisits')}
					value={formatNumber(member.gymVisits, locale)}
					subtitle={t('totalThisPeriod')}
				/>
				<StatCard
					title={t('upcomingClasses')}
					value={formatNumber(member.upcomingClasses.length, locale)}
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
						<ul className='flex flex-col gap-2'>
							{member.recentVisits.map((visit) => (
								<ListRow key={`${visit.date}-${visit.time}`}>
									<span>{formatDate(visit.date, locale)}</span>
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
						<ul className='flex flex-col gap-2'>
							{member.upcomingClasses.length > 0 ? (
								member.upcomingClasses.map((cls) => (
									<ListRow key={cls.id}>
										<div>
											<span className='font-medium'>{cls.name}</span>
											<span className='text-muted-foreground ml-2'>{formatDate(cls.date, locale)}</span>
										</div>
										<span className='text-muted-foreground'>{cls.time}</span>
									</ListRow>
								))
							) : (
								<p className='text-muted-foreground text-sm'>{t('noUpcomingClasses')}</p>
							)}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
