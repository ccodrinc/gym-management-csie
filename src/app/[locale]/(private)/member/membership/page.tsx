import { setRequestLocale } from 'next-intl/server'

import { MOCK_CURRENT_MEMBER } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberMembershipPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const member = MOCK_CURRENT_MEMBER

	return (
		<FadeIn className='space-y-6'>
			<div>
				<h1 className='text-foreground text-2xl font-semibold tracking-tight'>Membership</h1>
				<p className='text-muted-foreground text-sm'>Your plan and membership details</p>
			</div>

			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<CardTitle>{member.membershipType} Plan</CardTitle>
						<Badge variant={member.isActive ? 'default' : 'secondary'}>{member.isActive ? 'Active' : 'Expired'}</Badge>
					</div>
					<CardDescription>Full access to weights floor, turf zone, and group classes</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<p className='text-muted-foreground text-sm'>Start date</p>
							<p className='font-medium'>{member.startDate}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Expiry date</p>
							<p className='font-medium'>{member.expiryDate}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Total gym visits</p>
							<p className='font-medium'>{member.gymVisits}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
