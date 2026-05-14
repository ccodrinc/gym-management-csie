'use client'

import { Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { AppSidebar } from '@/app/[locale]/(private)/_components/app-sidebar'

export function TrainerSidebar() {
	const t = useTranslations('Trainer.nav')
	const tHeader = useTranslations('Header')

	return (
		<AppSidebar
			title={`${tHeader('brand')} ${t('title')}`}
			navItems={[{ href: '/trainer/classes', label: t('classes'), icon: Calendar }]}
			basePath='/trainer'
		/>
	)
}
