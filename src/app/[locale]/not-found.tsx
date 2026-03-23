import { getTranslations } from 'next-intl/server'

import { BrandMark } from '@/components/shared/brand-mark'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export default async function LocaleNotFound() {
	const [t, tHeader] = await Promise.all([getTranslations('NotFound'), getTranslations('Header')])

	return (
		<main
			id='main-content'
			className='flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-12 text-center'
		>
			<div className='text-primary inline-flex items-center gap-2 font-semibold tracking-tight'>
				<BrandMark priority />
				{tHeader('brand')}
			</div>
			<div className='flex max-w-md flex-col gap-2'>
				<p className='text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase'>{t('eyebrow')}</p>
				<h1 className='text-3xl font-semibold tracking-tight'>{t('title')}</h1>
				<p className='text-muted-foreground text-sm leading-6'>{t('description')}</p>
			</div>
			<Button asChild>
				<Link href='/'>{t('cta')}</Link>
			</Button>
		</main>
	)
}
