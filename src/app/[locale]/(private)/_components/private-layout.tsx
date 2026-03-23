'use client'

import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AdminSidebar } from '@/app/[locale]/(private)/admin/_components/admin-sidebar'
import { MemberSidebar } from '@/app/[locale]/(private)/member/_components/member-sidebar'

type PrivateLayoutProps = {
	children: React.ReactNode
	variant: 'admin' | 'member'
}

export function PrivateLayout({ children, variant }: PrivateLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const Sidebar = variant === 'admin' ? AdminSidebar : MemberSidebar
	const t = useTranslations('Sidebar')

	return (
		<div className='relative flex min-h-screen overflow-hidden'>
			{sidebarOpen ? (
				<button
					type='button'
					aria-label={t('close')}
					className='fixed inset-0 z-10 bg-black/20 backdrop-blur-[2px] transition-opacity md:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			) : null}

			<aside
				className={cn(
					'border-border bg-card fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r shadow-lg transition-transform duration-200 ease-in-out md:static md:z-0 md:translate-x-0 md:shadow-none',
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<Sidebar />
			</aside>

			<div className='flex min-h-screen min-w-0 flex-1 flex-col'>
				<header className='bg-background/95 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm md:hidden'>
					<Button
						type='button'
						variant='ghost'
						size='icon-sm'
						onClick={() => setSidebarOpen((open) => !open)}
						aria-label={sidebarOpen ? t('close') : t('open')}
					>
						{sidebarOpen ? (
							<PanelLeftClose
								aria-hidden='true'
								className='size-4'
							/>
						) : (
							<PanelLeft
								aria-hidden='true'
								className='size-4'
							/>
						)}
					</Button>
				</header>

				<main
					id='main-content'
					className='bg-muted/30 flex-1 overflow-y-auto p-4 md:p-6'
				>
					{children}
				</main>
			</div>
		</div>
	)
}
