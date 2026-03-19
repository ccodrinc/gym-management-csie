'use client'

import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { routing } from '@/i18n/routing'

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

	function getLocalizedPathname(newLocale: string): string {
		const currentPath = pathname || '/'
		const segments = currentPath.split('/')

		if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
			segments.splice(1, 1)
		}

		const unlocalizedPath = segments.join('/') || '/'
		const localizedPath = unlocalizedPath === '/' ? `/${newLocale}` : `/${newLocale}${unlocalizedPath}`
		const query = searchParams.toString()

		return query ? `${localizedPath}?${query}` : localizedPath
	}

	const handleLocaleChange = (newLocale: string) => {
		router.replace(getLocalizedPathname(newLocale))
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='header-ghost'
					size='sm'
					className='gap-2 px-2.5 sm:px-3'
				>
					<Languages className='size-4' />
					<span className='text-[11px] font-semibold tracking-[0.16em] uppercase'>
						{locale}
					</span>
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
