import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentMember } from '@/lib/data'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberProfilePage({ params }: Props) {
	const { locale } = await params

	const [member, t] = await Promise.all([
		getCurrentMember(locale),
		getTranslations({ locale, namespace: 'Member.profile' })
	])

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('accountDetails')}</CardTitle>
					<CardDescription>{t('accountDescription')}</CardDescription>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<p className='text-muted-foreground text-sm'>{t('name')}</p>
							<p className='font-medium'>{member.name}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>{t('username')}</p>
							<p className='font-medium'>{member.username ?? '—'}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>{t('phone')}</p>
							<p className='font-medium'>{member.phone ?? '—'}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
