'use client'

import type { LucideIcon } from 'lucide-react'
import { Dumbbell, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { LanguageSelect } from '@/components/language-select'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
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
	const t = useTranslations('Header')

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
				<span className='font-semibold tracking-tight'>{title}</span>
			</Link>
			<nav className='flex-1 space-y-1 p-2'>
				{navItems.map((item) => {
					const isActive = item.href === basePath ? pathname === basePath : pathname.startsWith(item.href)
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
			<div className='border-border flex flex-col gap-2 border-t p-3'>
				<div className='flex items-center justify-center gap-2'>
					<ThemeToggle />
					<LanguageSelect />
				</div>
				<Button
					variant='outline'
					size='sm'
					className='border-foreground/20 text-foreground hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2'
					onClick={() => signOut({ callbackUrl: '/' })}
				>
					<LogOut className='size-4' />
					{t('logOut')}
				</Button>
			</div>
		</aside>
	)
}
