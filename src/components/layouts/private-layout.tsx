'use client'

import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { MemberSidebar } from '@/components/member/member-sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PrivateLayoutProps = {
	children: React.ReactNode
	variant: 'admin' | 'member'
}

export function PrivateLayout({ children, variant }: PrivateLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true)
	const Sidebar = variant === 'admin' ? AdminSidebar : MemberSidebar
	const t = useTranslations('Sidebar')

	return (
		<div className='relative flex h-screen overflow-hidden'>
			{sidebarOpen && (
				<button
					type='button'
					aria-label={t('close')}
					className='fixed inset-0 z-10 bg-black/20 backdrop-blur-[2px] transition-opacity'
					onClick={() => setSidebarOpen(false)}
				/>
			)}
			<aside
				className={cn(
					'border-border bg-card fixed inset-y-0 left-0 z-20 flex w-56 flex-col border-r shadow-lg transition-transform duration-200 ease-in-out',
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<Sidebar />
			</aside>
			<div className='flex min-h-full w-full flex-col'>
				<header className='bg-background/95 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4'>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => setSidebarOpen((o) => !o)}
						aria-label={sidebarOpen ? t('close') : t('open')}
					>
						{sidebarOpen ? (
							<PanelLeftClose className='size-4' />
						) : (
							<PanelLeft className='size-4' />
						)}
					</Button>
				</header>
				<main className='bg-muted/30 flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}
