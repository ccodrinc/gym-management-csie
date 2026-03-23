'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
		<div
			role='alert'
			aria-live='assertive'
			className={cn('flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6 py-12 text-center', className)}
		>
			<div className='flex max-w-md flex-col gap-2'>
				<h2 className='text-foreground text-xl font-semibold text-balance'>{t('title')}</h2>
				<p className='text-muted-foreground text-sm leading-6'>{t('description')}</p>
			</div>
			<div className='flex flex-wrap items-center justify-center gap-3'>
				<Button
					type='button'
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
