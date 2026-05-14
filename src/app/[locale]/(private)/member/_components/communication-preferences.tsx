'use client'

import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export function CommunicationPreferences() {
	const t = useTranslations('Member.profile.communication')
	const [enabled, setEnabled] = useState(true)

	return (
		<div className='rounded-2xl border p-4'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex min-w-0 gap-3'>
					<div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
						<Mail className='size-5' />
					</div>
					<div className='min-w-0'>
						<p
							id='communication-email-title'
							className='font-medium'
						>
							{t('emailTitle')}
						</p>
						<p
							id='communication-email-description'
							className='text-muted-foreground mt-1 text-sm'
						>
							{t('emailDescription')}
						</p>
					</div>
				</div>

				<button
					type='button'
					role='switch'
					aria-checked={enabled}
					aria-labelledby='communication-email-title'
					aria-describedby='communication-email-description'
					onClick={() => setEnabled((current) => !current)}
					className={cn(
						'focus-visible:border-ring focus-visible:ring-ring/50 relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-[3px]',
						enabled ? 'bg-primary border-primary' : 'bg-muted border-border'
					)}
				>
					<span
						className={cn(
							'bg-background size-6 rounded-full shadow-sm transition-transform',
							enabled ? 'translate-x-7' : 'translate-x-1'
						)}
					/>
				</button>
			</div>

			<p className='text-muted-foreground mt-4 text-sm'>
				{enabled ? t('enabledMock') : t('disabledMock')}
			</p>
		</div>
	)
}
