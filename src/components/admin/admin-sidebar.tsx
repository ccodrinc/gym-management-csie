'use client'

import { Calendar, LayoutDashboard, LogIn, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { AppSidebar } from '@/components/layouts/app-sidebar'

export function AdminSidebar() {
	const t = useTranslations('Admin.nav')
	const navItems = [
		{ href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
		{ href: '/admin/users', label: t('users'), icon: Users },
		{ href: '/admin/classes', label: t('classes'), icon: Calendar },
		{ href: '/admin/check-ins', label: t('checkIns'), icon: LogIn }
	]

	return (
		<AppSidebar
			title='Reps Admin'
			navItems={navItems}
			basePath='/admin'
		/>
	)
}
