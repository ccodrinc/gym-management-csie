'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type ErrorFallbackProps = {
	error: Error & { digest?: string }
	reset: () => void
	className?: string
}

export function ErrorFallback({ error, reset, className }: ErrorFallbackProps) {
	const t = useTranslations('Error')

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className={className ?? 'flex min-h-screen flex-col items-center justify-center gap-6 px-6'}>
			<h2 className='text-foreground text-lg font-semibold'>{t('title')}</h2>
			<p className='text-muted-foreground max-w-sm text-center text-sm'>{t('description')}</p>
			<div className='flex gap-3'>
				<Button
					variant='outline'
					onClick={reset}
				>
					{t('tryAgain')}
				</Button>
				<Button asChild>
					<Link href='/'>{t('goHome')}</Link>
				</Button>
			</div>
		</div>
	)
}
