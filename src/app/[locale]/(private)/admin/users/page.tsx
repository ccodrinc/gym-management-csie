import { getTranslations } from 'next-intl/server'

import { UsersTable } from '@/app/[locale]/(private)/admin/_components/users-table'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMembers } from '@/lib/data'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminUsersPage({ params }: Props) {
	const { locale } = await params

	const [users, t] = await Promise.all([getMembers(locale), getTranslations({ locale, namespace: 'Admin.users' })])
	const activeCount = users.filter((u) => u.isActive).length

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t('allMembers')}</CardTitle>
					<CardDescription>{t('activeTotal', { active: activeCount, total: users.length })}</CardDescription>
				</CardHeader>
				<CardContent>
					<UsersTable users={users} />
				</CardContent>
			</Card>
		</div>
	)
}
