import { getTranslations } from 'next-intl/server'

import { MemberClassesContent } from '@/app/[locale]/(private)/member/_components/member-classes-content'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MAX_MEMBER_CLASS_ENROLLMENTS } from '@/lib/constants'
import { getClasses, getCurrentMember } from '@/lib/data'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberClassesPage({ params }: Props) {
	const { locale } = await params

	const [[schedule, member], t] = await Promise.all([
		Promise.all([getClasses(), getCurrentMember(locale)]),
		getTranslations({ locale, namespace: 'Member.classes' })
	])
	const bookingMap = new Map(
		member.upcomingClasses.map((booking) => [`${booking.gymClassId}:${booking.date}`, booking.id])
	)
	const classesWithBookings = schedule.map((gymClass) => ({
		...gymClass,
		bookingId: bookingMap.get(`${gymClass.id}:${gymClass.nextSessionDate}`) ?? null
	}))

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('schedule')}</CardTitle>
					<CardDescription>{t('dropIn')}</CardDescription>
				</CardHeader>
				<CardContent>
					<MemberClassesContent
						classes={classesWithBookings}
						hasActiveMembership={member.isActive}
						upcomingBookingCount={member.upcomingClasses.length}
						maxUpcomingBookings={MAX_MEMBER_CLASS_ENROLLMENTS}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
