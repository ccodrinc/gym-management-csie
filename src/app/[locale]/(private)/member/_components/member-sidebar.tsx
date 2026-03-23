'use client'

import { Calendar, CreditCard, LayoutDashboard, LogIn, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { AppSidebar } from '@/app/[locale]/(private)/_components/app-sidebar'

export function MemberSidebar() {
	const t = useTranslations('Member.nav')
	const tHeader = useTranslations('Header')

	return (
		<AppSidebar
			title={tHeader('brand')}
			navItems={[
				{ href: '/member', label: t('dashboard'), icon: LayoutDashboard },
				{ href: '/member/membership', label: t('membership'), icon: CreditCard },
				{ href: '/member/classes', label: t('classes'), icon: Calendar },
				{ href: '/member/visits', label: t('visits'), icon: LogIn },
				{ href: '/member/profile', label: t('profile'), icon: User }
			]}
			basePath='/member'
		/>
	)
}
