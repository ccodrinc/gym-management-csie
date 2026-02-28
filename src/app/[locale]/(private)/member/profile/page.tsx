import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentMember } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberProfilePage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const [member, t] = await Promise.all([
		getCurrentMember(),
		getTranslations('Member.profile')
	])

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<Card>
				<CardHeader>
					<CardTitle>{t('contactDetails')}</CardTitle>
					<CardDescription>Update your details in the gym app settings</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<p className='text-muted-foreground text-sm'>{t('name')}</p>
							<p className='font-medium'>{member.name}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>{t('email')}</p>
							<p className='font-medium'>{member.email}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>{t('phone')}</p>
							<p className='font-medium'>{(member as { phone?: string }).phone ?? '—'}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
