'use client'

import { Database } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { seedDatabaseAction } from '@/app/actions/seed'
import { Button } from '@/components/ui/button'

export function SeedDataButton() {
	const t = useTranslations('Admin.dashboard')
	const [pending, setPending] = useState(false)

	async function handleClick() {
		setPending(true)
		try {
			const result = await seedDatabaseAction()
			if (result.ok) {
				toast.success(t('seedSuccess'))
				window.location.reload()
			} else {
				toast.error(result.error)
			}
		} finally {
			setPending(false)
		}
	}

	return (
		<Button
			variant='outline'
			size='sm'
			onClick={handleClick}
			disabled={pending}
		>
			<Database className='size-4' />
			{pending ? t('seedPending') : t('seedData')}
		</Button>
	)
}
