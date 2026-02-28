'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
	const { setTheme } = useTheme()
	const t = useTranslations('ThemeToggle')

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon-sm'
					className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5 relative'
				>
					<Sun className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
					<Moon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
					<span className='sr-only'>{t('label')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onSelect={() => setTheme('light')}>
					<Sun className='mr-2 size-4' />
					{t('light')}
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => setTheme('dark')}>
					<Moon className='mr-2 size-4' />
					{t('dark')}
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => setTheme('system')}>
					<Monitor className='mr-2 size-4' />
					{t('system')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
