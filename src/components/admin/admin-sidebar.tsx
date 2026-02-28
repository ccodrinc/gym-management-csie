'use client'

import { LayoutDashboard, Users } from 'lucide-react'

import { AppSidebar } from '@/components/layouts/app-sidebar'

const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/admin/users', label: 'Users', icon: Users }
]

export function AdminSidebar() {
	return (
		<AppSidebar
			title='Reps Admin'
			navItems={navItems}
			basePath='/admin'
		/>
	)
}
