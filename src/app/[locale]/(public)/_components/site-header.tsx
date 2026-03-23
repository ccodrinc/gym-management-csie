import { getTranslations } from 'next-intl/server'

import { getSession } from '@/auth'
import { BrandMark } from '@/components/shared/brand-mark'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { UserControlsBar } from '@/components/shared/user-controls-bar'
import { Button } from '@/components/ui/button'
import { Role } from '@/generated/prisma/client'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type SiteHeaderProps = {
	locale: string
}

type NavLinkProps = {
	href: string
	locale: string
	children: React.ReactNode
	className?: string
}

function SiteNavLink({ href, locale, children, className }: NavLinkProps) {
	return (
		<Link
			href={href}
			locale={locale}
			className={cn(
				'text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center rounded-md px-1 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
				className
			)}
		>
			{children}
		</Link>
	)
}

export async function SiteHeader({ locale }: SiteHeaderProps) {
	const [t, session] = await Promise.all([getTranslations({ locale, namespace: 'Header' }), getSession()])
	const isAdmin = session?.user?.role === Role.ADMIN
	const dashboardHref = isAdmin ? '/admin' : '/member'

	return (
		<header className='border-border bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur-md'>
			<div className='mx-auto max-w-6xl px-4 sm:px-6'>
				<div className='flex min-h-16 flex-wrap items-center justify-between gap-4 py-3 md:flex-nowrap md:py-0'>
					<div className='flex min-w-0 items-center gap-6'>
						<Link
							href='/'
							locale={locale}
							className='text-primary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2 font-semibold tracking-tight transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
						>
							<BrandMark priority />
							{t('brand')}
						</Link>
						<nav
							aria-label={t('home')}
							className='hidden items-center gap-6 md:flex'
						>
							<SiteNavLink
								href='/'
								locale={locale}
							>
								{t('home')}
							</SiteNavLink>
							{!isAdmin ? (
								<SiteNavLink
									href='/pricing'
									locale={locale}
								>
									{t('memberships')}
								</SiteNavLink>
							) : null}
						</nav>
					</div>

					<UserControlsBar
						layout='inline'
						className='shrink-0'
						authSlot={
							session ? (
								<>
									<Button
										asChild
										size='sm'
										variant='header-ghost'
									>
										<Link
											href={dashboardHref}
											locale={locale}
										>
											{t('dashboard')}
										</Link>
									</Button>
									<SignOutButton variant='header' />
								</>
							) : (
								<Button
									asChild
									size='sm'
									variant='header-ghost'
								>
									<Link
										href='/login'
										locale={locale}
									>
										{t('logIn')}
									</Link>
								</Button>
							)
						}
					/>
				</div>

				<nav
					aria-label={t('home')}
					className='flex items-center gap-4 border-t py-3 md:hidden'
				>
					<SiteNavLink
						href='/'
						locale={locale}
					>
						{t('home')}
					</SiteNavLink>
					{!isAdmin ? (
						<SiteNavLink
							href='/pricing'
							locale={locale}
						>
							{t('memberships')}
						</SiteNavLink>
					) : null}
				</nav>
			</div>
		</header>
	)
}
