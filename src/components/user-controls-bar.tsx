'use client'

import { LanguageSelect } from '@/components/language-select'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

type UserControlsBarProps = {
	layout?: 'inline' | 'stacked'
	authSlot?: React.ReactNode
	className?: string
}

export function UserControlsBar({ layout = 'inline', authSlot, className }: UserControlsBarProps) {
	return (
		<div
			className={cn(
				layout === 'inline' && 'flex items-center gap-2',
				layout === 'stacked' && 'flex flex-col gap-2',
				className
			)}
		>
			<div className={cn('flex items-center gap-2', layout === 'stacked' && 'justify-center')}>
				<ThemeToggle />
				<LanguageSelect />
			</div>
			{authSlot}
		</div>
	)
}
