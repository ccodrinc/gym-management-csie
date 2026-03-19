import { getTranslations } from 'next-intl/server'

import { UsersTable } from '@/components/admin/users-table'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMembers } from '@/lib/data'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminUsersPage({ params }: Props) {
	const { locale } = await params

	const [users, t] = await Promise.all([
		getMembers(locale),
		getTranslations({ locale, namespace: 'Admin.users' })
	])
	const activeCount = users.filter((u) => u.isActive).length

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />

			<Card>
				<CardHeader>
					<CardTitle>{t('allMembers')}</CardTitle>
					<CardDescription>
						{t('activeTotal', { active: activeCount, total: users.length })}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UsersTable users={users} />
				</CardContent>
			</Card>
		</FadeIn>
	)
}
