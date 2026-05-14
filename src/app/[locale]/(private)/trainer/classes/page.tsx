import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { AdminClassesContent } from '@/app/[locale]/(private)/admin/_components/admin-classes-content'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession } from '@/auth'
import { Role } from '@/generated/prisma/client'
import { getClasses, getMembers } from '@/lib/data'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function TrainerClassesPage({ params }: Props) {
	const { locale } = await params
	const session = await getSession()

	if (!session?.user) {
		redirect(`/${locale}/login`)
	}

	if (session.user.role !== Role.TRAINER) {
		redirect(session.user.role === Role.ADMIN ? `/${locale}/admin` : `/${locale}/member`)
	}

	const [classes, members, t, tAdminClasses] = await Promise.all([
		getClasses({ trainerId: session.user.id }),
		getMembers(locale),
		getTranslations({ locale, namespace: 'Trainer.classes' }),
		getTranslations({ locale, namespace: 'Admin.classes' })
	])

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('assignedSchedule')}</CardTitle>
					<CardDescription>
						{tAdminClasses('capacity')}: {classes.reduce((sum, c) => sum + c.nextSessionBookings, 0)} /{' '}
						{classes.reduce((sum, c) => sum + c.maxSpots, 0)} {tAdminClasses('spots')}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AdminClassesContent
						classes={classes}
						members={members}
						mode='trainer'
					/>
				</CardContent>
			</Card>
		</div>
	)
}
