import { setRequestLocale } from 'next-intl/server'

import { MembershipChart, WeeklyVisitsChart } from '@/components/admin/dashboard-charts'
import { getAnalytics } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminDashboardPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const { totalMembers, activeToday, newThisMonth, avgCheckinsPerDay, visitsPerDay, membershipBreakdown } =
		await getAnalytics()

	return (
		<FadeIn className='space-y-8'>
			<div>
				<h1 className='text-foreground text-2xl font-semibold tracking-tight'>Dashboard</h1>
				<p className='text-muted-foreground text-sm'>Overview of gym activity and members</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Members</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalMembers.toLocaleString()}</div>
						<p className='text-muted-foreground text-xs'>All-time registered</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Active Today</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{activeToday}</div>
						<p className='text-muted-foreground text-xs'>Check-ins in the last 24h</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>New This Month</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{newThisMonth}</div>
						<p className='text-muted-foreground text-xs'>New memberships</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Avg Check-ins/Day</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{avgCheckinsPerDay}</div>
						<p className='text-muted-foreground text-xs'>7-day rolling average</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Weekly Visits</CardTitle>
						<CardDescription>Check-ins per day (last 7 days)</CardDescription>
					</CardHeader>
					<CardContent>
						<WeeklyVisitsChart data={visitsPerDay} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Membership Distribution</CardTitle>
						<CardDescription>By plan type</CardDescription>
					</CardHeader>
					<CardContent>
						<MembershipChart data={membershipBreakdown} />
					</CardContent>
				</Card>
			</div>
		</FadeIn>
	)
}
