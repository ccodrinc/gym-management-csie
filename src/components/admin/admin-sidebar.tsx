'use client'

import { Dumbbell, LayoutDashboard, Users } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/admin/users', label: 'Users', icon: Users }
]

export function AdminSidebar() {
	const pathname = usePathname()

	return (
		<aside className='border-border bg-card flex h-full w-56 flex-col border-r'>
			<Link
				href='/'
				className='hover:bg-muted/50 flex h-16 items-center gap-2 border-b px-6'
			>
				<Dumbbell
					className='text-primary size-5'
					strokeWidth={2}
				/>
				<span className='font-semibold tracking-tight'>Reps Admin</span>
			</Link>
			<nav className='flex-1 space-y-1 p-2'>
				{navItems.map((item) => {
					const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
					const Icon = item.icon
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
								isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							<Icon className='size-4' />
							{item.label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
