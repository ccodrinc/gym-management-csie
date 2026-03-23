import { getTranslations } from 'next-intl/server'

import { MembershipManager } from '@/app/[locale]/(private)/member/_components/membership-manager'
import { PageHeader } from '@/components/shared/page-header'
import { getCurrentMember } from '@/lib/data'
import { getMembershipTypeFromQuery } from '@/lib/membership'

type Props = {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ plan?: string }>
}

export default async function MemberMembershipPage({ params, searchParams }: Props) {
	const { locale } = await params
	const { plan } = await searchParams

	const [member, t] = await Promise.all([
		getCurrentMember(locale),
		getTranslations({ locale, namespace: 'Member.membership' })
	])

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title={t('title')}
				description={t('description')}
			/>
			<MembershipManager
				member={member}
				preferredPlan={getMembershipTypeFromQuery(plan)}
			/>
		</div>
	)
}
