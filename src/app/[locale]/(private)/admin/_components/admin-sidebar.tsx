'use client'

import { Calendar, LayoutDashboard, LogIn, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { AppSidebar } from '@/app/[locale]/(private)/_components/app-sidebar'

export function AdminSidebar() {
	const t = useTranslations('Admin.nav')
	const tHeader = useTranslations('Header')

	return (
		<AppSidebar
			title={`${tHeader('brand')} ${tHeader('admin')}`}
			navItems={[
				{ href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
				{ href: '/admin/users', label: t('users'), icon: Users },
				{ href: '/admin/classes', label: t('classes'), icon: Calendar },
				{ href: '/admin/check-ins', label: t('checkIns'), icon: LogIn }
			]}
			basePath='/admin'
		/>
	)
}
