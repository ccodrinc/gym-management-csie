import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getClasses } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminClassesPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const [classes, t] = await Promise.all([
		getClasses(),
		getTranslations('Admin.classes')
	])

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<Card>
				<CardHeader>
					<CardTitle>{t('schedule')}</CardTitle>
					<CardDescription>
						{t('capacity')}: {classes.reduce((sum, c) => sum + c.spots, 0)} / {classes.reduce((sum, c) => sum + c.maxSpots, 0)} {t('spots')}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{classes.map((cls) => (
							<div
								key={cls.id}
								className='flex items-center justify-between rounded-md border px-4 py-3'
							>
								<div>
									<p className='font-medium'>{cls.name}</p>
									<p className='text-muted-foreground text-sm'>
										{cls.day} · {cls.time}
									</p>
								</div>
								<div className='text-right'>
									<p className='text-sm'>
										{cls.spots}/{cls.maxSpots} {t('spots')}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
