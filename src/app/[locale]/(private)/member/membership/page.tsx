import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { MembershipManager } from '@/components/member/membership-manager'
import { PageHeader } from '@/components/ui/page-header'
import { getCurrentMember } from '@/lib/data'
import { FadeIn } from '@/components/motion'
import { getMembershipTypeFromQuery } from '@/lib/membership'

type Props = {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ plan?: string }>
}

export default async function MemberMembershipPage({ params, searchParams }: Props) {
	const { locale } = await params
	const { plan } = await searchParams
	setRequestLocale(locale)

	const [member, t] = await Promise.all([
		getCurrentMember(),
		getTranslations('Member.membership')
	])

	return (
		<FadeIn className='space-y-6'>
			<PageHeader title={t('title')} description={t('description')} />
			<MembershipManager
				member={member}
				preferredPlan={getMembershipTypeFromQuery(plan)}
			/>
		</FadeIn>
	)
}
