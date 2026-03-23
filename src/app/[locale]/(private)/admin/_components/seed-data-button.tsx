'use client'

import { Database } from 'lucide-react'
import { startTransition, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { seedDatabaseAction } from '@/app/actions/seed'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'

export function SeedDataButton() {
	const router = useRouter()
	const t = useTranslations('Admin.dashboard')
	const [pending, setPending] = useState(false)

	function handleClick() {
		setPending(true)

		startTransition(async () => {
			try {
				const result = await seedDatabaseAction()
				if (!result.ok) {
					toast.error(result.error)
					return
				}

				toast.success(t('seedSuccess'))
				router.refresh()
			} finally {
				setPending(false)
			}
		})
	}

	return (
		<Button
			type='button'
			variant='outline'
			size='sm'
			onClick={handleClick}
			disabled={pending}
		>
			<Database data-icon='inline-start' />
			{pending ? t('seedPending') : t('seedData')}
		</Button>
	)
}
