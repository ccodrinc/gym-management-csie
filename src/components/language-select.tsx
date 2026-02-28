'use client'

import { Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { routing } from '@/i18n/routing'
import { useRouter, usePathname } from '@/i18n/navigation'

const localeLabels: Record<string, string> = {
	en: 'English'
}

export function LanguageSelect() {
	const t = useTranslations('LanguageSelect')
	const router = useRouter()
	const pathname = usePathname()

	const handleLocaleChange = (newLocale: string) => {
		router.replace(pathname, { locale: newLocale })
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon-sm'
					className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5 relative'
				>
					<Languages className='size-4' />
					<span className='sr-only'>{t('label')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{routing.locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => handleLocaleChange(loc)}
					>
						{localeLabels[loc] ?? loc}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
