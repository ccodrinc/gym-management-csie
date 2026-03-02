'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Pressable } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SignOutButtonProps = {
	variant?: 'header' | 'sidebar'
	className?: string
}

export function SignOutButton({ variant = 'header', className }: SignOutButtonProps) {
	const t = useTranslations('Header')

	const button = (
		<Button
			variant={variant === 'header' ? 'header-ghost' : 'outline'}
			size='sm'
			className={cn(
				variant === 'sidebar' &&
					'hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2',
				className
			)}
			onClick={() => signOut({ callbackUrl: '/' })}
		>
			{variant === 'sidebar' && <LogOut className='size-4' />}
			{t('logOut')}
		</Button>
	)

	return variant === 'header' ? <Pressable>{button}</Pressable> : button
}
