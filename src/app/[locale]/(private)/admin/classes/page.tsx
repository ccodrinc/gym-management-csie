import { getTranslations } from 'next-intl/server'

import { AdminClassesContent } from '@/components/admin/admin-classes-content'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getClasses, getMembers } from '@/lib/data'
import { FadeIn } from '@/components/motion'

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
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<Card>
				<CardHeader>
					<CardTitle>{t('schedule')}</CardTitle>
					<CardDescription>
						{t('capacity')}: {classes.reduce((sum, c) => sum + c.nextSessionBookings, 0)} / {classes.reduce((sum, c) => sum + c.maxSpots, 0)} {t('spots')}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AdminClassesContent classes={classes} members={members} />
				</CardContent>
			</Card>
		</FadeIn>
	)
}
