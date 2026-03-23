'use client'

import { LogOut } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SignOutButtonProps = {
	variant?: 'header' | 'sidebar'
	className?: string
}

export function SignOutButton({ variant = 'header', className }: SignOutButtonProps) {
	const locale = useLocale()
	const t = useTranslations('Header')
	const [pending, setPending] = useState(false)

	async function handleSignOut() {
		setPending(true)
		await signOut({ callbackUrl: `/${locale}` })
	}

	return (
		<Button
			type='button'
			variant={variant === 'header' ? 'header-ghost' : 'outline'}
			size='sm'
			className={cn(
				variant === 'sidebar' &&
					'hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2',
				className
			)}
			onClick={handleSignOut}
			disabled={pending}
		>
			{variant === 'sidebar' ? <LogOut data-icon='inline-start' /> : null}
			{t('logOut')}
		</Button>
	)
}
