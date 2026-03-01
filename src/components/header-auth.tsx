'use client'

import { signOut } from 'next-auth/react'

import { Pressable } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function HeaderSignOut() {
	const t = useTranslations('Header')

	return (
		<Pressable>
			<Button
				variant='outline'
				size='sm'
				className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5'
				onClick={() => signOut({ callbackUrl: '/' })}
			>
				{t('logOut')}
			</Button>
		</Pressable>
	)
}
