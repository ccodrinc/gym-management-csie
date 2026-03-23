'use client'

import { Languages } from 'lucide-react'
import { startTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const localeTranslationKeys = {
	en: 'english',
	ro: 'romanian'
} as const

function getLocaleLabel(t: ReturnType<typeof useTranslations>, locale: string): string {
	const key = localeTranslationKeys[locale as keyof typeof localeTranslationKeys]
	return key ? t(key) : locale
}

export function LanguageSelect() {
	const t = useTranslations('LanguageSelect')
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	function handleLocaleChange(nextLocale: string) {
		if (nextLocale === locale) {
			return
		}

		const currentPath = pathname || '/'
		const query = searchParams.toString()
		const href = query ? `${currentPath}?${query}` : currentPath

		startTransition(() => {
			router.replace(href, { locale: nextLocale })
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='header-ghost'
					size='sm'
					className='gap-2 px-2.5 sm:px-3'
					aria-label={t('label')}
				>
					<Languages data-icon='inline-start' />
					<span className='text-[11px] font-semibold tracking-[0.16em] uppercase'>{locale}</span>
					<span className='sr-only'>{t('label')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='end'
				className='min-w-40'
			>
				<DropdownMenuRadioGroup
					value={locale}
					onValueChange={handleLocaleChange}
				>
					{routing.locales.map((loc) => (
						<DropdownMenuRadioItem
							key={loc}
							value={loc}
						>
							{getLocaleLabel(t, loc)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
