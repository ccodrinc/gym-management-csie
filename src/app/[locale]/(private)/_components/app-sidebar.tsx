'use client'

import type { LucideIcon } from 'lucide-react'

import { BrandMark } from '@/components/shared/brand-mark'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { UserControlsBar } from '@/components/shared/user-controls-bar'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type NavItem = {
	href: string
	label: string
	icon: LucideIcon
}

type AppSidebarProps = {
	title: string
	navItems: NavItem[]
	basePath: string
}

export function AppSidebar({ title, navItems, basePath }: AppSidebarProps) {
	const pathname = usePathname()

	return (
		<aside className='border-border bg-card flex h-full w-64 flex-col border-r'>
			<Link
				href='/'
				className='hover:bg-muted/50 focus-visible:ring-ring flex h-16 items-center gap-2 border-b px-6 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset'
			>
				<BrandMark />
				<span className='font-semibold tracking-tight'>{title}</span>
			</Link>

			<nav
				aria-label={title}
				className='flex flex-1 flex-col gap-1 p-3'
			>
				{navItems.map((item) => {
					const isActive = item.href === basePath ? pathname === basePath : pathname.startsWith(item.href)
					const Icon = item.icon

					return (
						<Link
							key={item.href}
							href={item.href}
							aria-current={isActive ? 'page' : undefined}
							className={cn(
								'focus-visible:ring-ring focus-visible:ring-offset-card flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
								isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							<Icon
								aria-hidden='true'
								className='size-4'
							/>
							{item.label}
						</Link>
					)
				})}
			</nav>

			<div className='border-border flex shrink-0 flex-col border-t p-3'>
				<UserControlsBar
					layout='row'
					authSlot={<SignOutButton variant='sidebar' />}
				/>
			</div>
		</aside>
	)
}
