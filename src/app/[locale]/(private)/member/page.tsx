import { setRequestLocale } from 'next-intl/server'

import { MOCK_CURRENT_MEMBER } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberDashboardPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const member = MOCK_CURRENT_MEMBER

	return (
		<FadeIn className='space-y-8'>
			<div>
				<h1 className='text-foreground text-2xl font-semibold tracking-tight'>
					Welcome back, {member.name.split(' ')[0]}
				</h1>
				<p className='text-muted-foreground text-sm'>Here's your gym activity at a glance</p>
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Membership</CardTitle>
						<Badge variant={member.isActive ? 'default' : 'secondary'}>{member.isActive ? 'Active' : 'Expired'}</Badge>
					</CardHeader>
					<CardContent>
						<div className='text-xl font-bold'>{member.membershipType}</div>
						<p className='text-muted-foreground text-xs'>Valid until {member.expiryDate}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Gym Visits</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{member.gymVisits}</div>
						<p className='text-muted-foreground text-xs'>Total this membership period</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Upcoming Classes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{member.upcomingClasses.length}</div>
						<p className='text-muted-foreground text-xs'>Booked for this week</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Recent Visits</CardTitle>
						<CardDescription>Your last 5 check-ins</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='space-y-3'>
							{member.recentVisits.map((visit, i) => (
								<li
									key={i}
									className='flex items-center justify-between rounded-md border px-4 py-2 text-sm'
								>
									<span>{visit.date}</span>
									<span className='text-muted-foreground'>{visit.time}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Upcoming Classes</CardTitle>
						<CardDescription>Your booked sessions</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='space-y-3'>
							{member.upcomingClasses.map((cls, i) => (
								<li
									key={i}
									className='flex items-center justify-between rounded-md border px-4 py-2 text-sm'
								>
									<div>
										<span className='font-medium'>{cls.name}</span>
										<span className='text-muted-foreground ml-2'>{cls.date}</span>
									</div>
									<span className='text-muted-foreground'>{cls.time}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</FadeIn>
	)
}
