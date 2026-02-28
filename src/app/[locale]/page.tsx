import { Dumbbell, Clock, Users } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { LanguageSelect } from '@/components/language-select'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const t = await getTranslations()

	return (
		<div className='flex min-h-screen flex-col'>
			<header className='border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl'>
				<div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
					<Link
						href='/'
						className='text-primary flex items-center gap-2 font-semibold tracking-tight'
					>
						<Dumbbell
							className='size-5'
							strokeWidth={2}
						/>
						{t('Header.brand')}
					</Link>
					<nav className='hidden gap-8 md:flex'>
						<a
							href='#amenities'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							{t('Header.classes')}
						</a>
						<a
							href='#cta'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							{t('Header.memberships')}
						</a>
					</nav>
					<div className='flex items-center gap-2'>
						<ThemeToggle />
						<LanguageSelect />
						<Button
							asChild
							size='sm'
							variant='outline'
							className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5'
						>
							<Link href='/login'>{t('Header.logIn')}</Link>
						</Button>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				<section className='relative overflow-hidden'>
					<div className='bg-primary/20 absolute top-0 -right-32 h-96 w-96 rounded-full blur-3xl' />
					<div className='bg-primary/10 absolute top-48 -left-32 h-64 w-64 rounded-full blur-3xl' />
					<div className='relative mx-auto max-w-6xl px-6 pt-28 pb-36 md:pt-40 md:pb-48'>
						<div className='max-w-2xl'>
							<p className='text-primary mb-6 font-mono text-sm'>{t('Hero.badge')}</p>
							<h1 className='text-foreground font-sans text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl'>
								{t('Hero.headline')}
							</h1>
							<p className='text-muted-foreground mt-6 text-lg leading-relaxed'>{t('Hero.subheadline')}</p>
							<div className='mt-10 flex gap-3'>
								<Button
									size='lg'
									className='px-8'
								>
									{t('Hero.getDayPass')}
								</Button>
								<Button
									size='lg'
									variant='ghost'
									className='text-muted-foreground hover:text-foreground'
								>
									{t('Hero.viewSchedule')}
								</Button>
							</div>
						</div>
					</div>
				</section>

				<section
					id='amenities'
					className='border-border bg-muted/30 border-t py-24'
				>
					<div className='mx-auto max-w-6xl px-6'>
						<h2 className='mb-16 font-sans text-3xl font-semibold tracking-tight md:text-4xl'>
							{t('Amenities.title')}
						</h2>
						<div className='grid gap-6 md:grid-cols-2 md:gap-8'>
							<Card className='border-border bg-card md:col-span-2 lg:col-span-1'>
								<CardHeader>
									<Clock
										className='text-primary mb-3 size-8'
										strokeWidth={1.5}
									/>
									<CardTitle className='text-xl'>{t('Amenities.access24.title')}</CardTitle>
									<CardDescription>{t('Amenities.access24.description')}</CardDescription>
								</CardHeader>
							</Card>
							<Card className='border-border bg-card'>
								<CardHeader>
									<Dumbbell
										className='text-primary mb-3 size-8'
										strokeWidth={1.5}
									/>
									<CardTitle className='text-xl'>{t('Amenities.weightsFloor.title')}</CardTitle>
									<CardDescription>{t('Amenities.weightsFloor.description')}</CardDescription>
								</CardHeader>
							</Card>
							<Card className='border-primary/20 bg-primary/5'>
								<CardHeader>
									<Users
										className='text-primary mb-3 size-8'
										strokeWidth={1.5}
									/>
									<CardTitle className='text-xl'>{t('Amenities.groupClasses.title')}</CardTitle>
									<CardDescription>{t('Amenities.groupClasses.description')}</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>

				<section className='border-border border-t py-24'>
					<div className='mx-auto max-w-6xl px-6'>
						<div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
							<div>
								<h3 className='font-sans text-2xl font-semibold tracking-tight'>{t('CTA.title')}</h3>
								<p className='text-muted-foreground mt-2'>{t('CTA.description')}</p>
							</div>
							<Button
								size='lg'
								className='shrink-0 px-8'
							>
								{t('CTA.button')}
							</Button>
						</div>
					</div>
				</section>
			</main>

			<footer className='border-border border-t py-8'>
				<div className='mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between'>
					<p className='text-muted-foreground text-sm'>{t('Footer.copyright')}</p>
					<div className='flex gap-6'>
						<a
							href='#'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							{t('Footer.privacy')}
						</a>
						<a
							href='#'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							{t('Footer.terms')}
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}
