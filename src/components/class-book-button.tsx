'use client'

import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function ClassBookButton() {
	const t = useTranslations('Member.classes')

	return (
		<button
			type='button'
			className='text-primary mt-1 text-sm font-medium hover:underline'
			onClick={() => toast.info(t('bookToast'))}
		>
			{t('book')}
		</button>
	)
}
