'use client'

import { LanguageSelect } from '@/components/language-select'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

type UserControlsBarProps = {
	layout?: 'inline' | 'stacked' | 'row'
	authSlot?: React.ReactNode
	className?: string
}

export function UserControlsBar({ layout = 'inline', authSlot, className }: UserControlsBarProps) {
	if (layout === 'row') {
		return (
			<div className={cn('flex w-full flex-nowrap items-center gap-2', className)}>
				<div className='flex shrink-0 items-center gap-1'>
					<ThemeToggle />
					<LanguageSelect />
				</div>
				{authSlot && <div className='min-w-0 flex-1'>{authSlot}</div>}
			</div>
		)
	}

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
