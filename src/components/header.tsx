import { getTranslations } from 'next-intl/server'

import { getSession } from '@/auth'
import { BrandMark } from '@/components/brand-mark'
import { AnimatedNavLink, LogoLink, Pressable } from '@/components/motion'
import { SignOutButton } from '@/components/sign-out-button'
import { UserControlsBar } from '@/components/user-controls-bar'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { Role } from '@prisma/client'

export async function Header({ locale }: { locale: string }) {
	const t = await getTranslations({ locale, namespace: 'Header' })
	const session = await getSession()
	const isAdmin = session?.user?.role === Role.ADMIN

	return (
		<header className='border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl'>
			<div className='mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
				<LogoLink href='/'>
					<BrandMark priority />
					{t('brand')}
				</LogoLink>
				<nav className='hidden gap-8 md:flex'>
					<AnimatedNavLink href='/'>{t('home')}</AnimatedNavLink>
					{!isAdmin && <AnimatedNavLink href='/pricing'>{t('memberships')}</AnimatedNavLink>}
				</nav>
				<UserControlsBar
					layout='inline'
					className='shrink-0'
					authSlot={
						session ? (
							<>
								<Pressable>
									<Button
										asChild
										size='sm'
										variant='header-ghost'
									>
										<Link href={isAdmin ? '/admin' : '/member'}>{t('dashboard')}</Link>
									</Button>
								</Pressable>
								<SignOutButton variant='header' />
							</>
						) : (
							<Pressable>
								<Button
									asChild
									size='sm'
									variant='header-ghost'
								>
									<Link href='/login'>{t('logIn')}</Link>
								</Button>
							</Pressable>
						)
					}
				/>
			</div>
		</header>
	)
}
