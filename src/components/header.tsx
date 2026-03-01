import { Dumbbell } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { HeaderSignOut } from '@/components/header-auth'
import { LanguageSelect } from '@/components/language-select'
import { AnimatedNavLink, LogoLink, Pressable } from '@/components/motion'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { isDemoMode } from '@/lib/auth'
import { Role } from '@prisma/client'

export async function Header() {
	const t = await getTranslations('Header')
	const session = await auth()
	const demoMode = isDemoMode
	const isAdmin = session?.user?.role === Role.ADMIN || demoMode

	return (
		<header className='border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl'>
			<div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
				<LogoLink href='/'>
					<Dumbbell
						className='size-5'
						strokeWidth={2}
					/>
					{t('brand')}
				</LogoLink>
				<nav className='hidden gap-8 md:flex'>
					<AnimatedNavLink href='/'>{t('home')}</AnimatedNavLink>
					<AnimatedNavLink href='/pricing'>{t('memberships')}</AnimatedNavLink>
				</nav>
				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<LanguageSelect />
					<AnimatedNavLink href='/member'>{t('dashboard')}</AnimatedNavLink>
					{isAdmin && (
						<AnimatedNavLink href='/admin'>{t('admin')}</AnimatedNavLink>
					)}
					{session ? (
						<HeaderSignOut />
					) : (
						<Pressable>
							<Button
								asChild
								size='sm'
								variant='outline'
								className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5'
							>
								<Link href='/login'>{t('logIn')}</Link>
							</Button>
						</Pressable>
					)}
				</div>
			</div>
		</header>
	)
}
