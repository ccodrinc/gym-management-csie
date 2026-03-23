'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
	const { setTheme } = useTheme()
	const t = useTranslations('ThemeToggle')

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='header-ghost'
					size='icon-sm'
					className='relative touch-manipulation'
					aria-label={t('label')}
				>
					<Sun className='size-4 scale-100 rotate-0 transition-[transform,opacity] dark:scale-0 dark:-rotate-90' />
					<Moon className='absolute size-4 scale-0 rotate-90 transition-[transform,opacity] dark:scale-100 dark:rotate-0' />
					<span className='sr-only'>{t('label')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={() => setTheme('light')}>
						<Sun data-icon='inline-start' />
						{t('light')}
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setTheme('dark')}>
						<Moon data-icon='inline-start' />
						{t('dark')}
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setTheme('system')}>
						<Monitor data-icon='inline-start' />
						{t('system')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
