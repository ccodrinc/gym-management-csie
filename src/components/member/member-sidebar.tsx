'use client'

import { Calendar, CreditCard, LayoutDashboard } from 'lucide-react'

import { AppSidebar } from '@/components/layouts/app-sidebar'

const navItems = [
	{ href: '/member', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/member/membership', label: 'Membership', icon: CreditCard },
	{ href: '/member/classes', label: 'Classes', icon: Calendar }
]

export function MemberSidebar() {
	return (
		<AppSidebar
			title='Reps'
			navItems={navItems}
			basePath='/member'
		/>
	)
}
