import { getTranslations } from 'next-intl/server'

import { AdminClassesContent } from '@/app/[locale]/(private)/admin/_components/admin-classes-content'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getClasses, getMembers } from '@/lib/data'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminClassesPage({ params }: Props) {
	const { locale } = await params

	const [classes, members, t] = await Promise.all([
		getClasses(),
		getMembers(locale),
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
					<CardTitle>{t('schedule')}</CardTitle>
					<CardDescription>
						{t('capacity')}: {classes.reduce((sum, c) => sum + c.nextSessionBookings, 0)} /{' '}
						{classes.reduce((sum, c) => sum + c.maxSpots, 0)} {t('spots')}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AdminClassesContent
						classes={classes}
						members={members}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
