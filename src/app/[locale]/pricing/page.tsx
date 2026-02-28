import { Check, Dumbbell } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function PricingPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const t = await getTranslations('Pricing')
	const tHeader = await getTranslations('Header')

	const plans = ['dayPass', 'monthly', 'annual'] as const

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
						Reps
					</Link>
					<nav className='flex gap-8'>
						<Link
							href='/'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							{tHeader('home')}
						</Link>
						<Link
							href='/pricing'
							className='text-foreground text-sm font-medium'
						>
							{t('title')}
						</Link>
					</nav>
					<Link href='/login'>
						<Button
							size='sm'
							variant='outline'
							className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5'
						>
							{tHeader('logIn')}
						</Button>
					</Link>
				</div>
			</header>

			<main className='flex-1 px-6 py-24'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-16 text-center'>
						<h1 className='text-foreground font-sans text-4xl font-semibold tracking-tight md:text-5xl'>
							{t('title')}
						</h1>
						<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>{t('subtitle')}</p>
					</div>

					<div className='grid gap-8 md:grid-cols-3'>
						{plans.map((plan) => {
							const isPopular = plan === 'monthly'
							return (
								<Card
									key={plan}
									className={`relative flex flex-col ${
										isPopular ? 'border-primary/50 bg-primary/5 shadow-lg' : 'border-border bg-card'
									}`}
								>
									{isPopular && (
										<div className='bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium'>
											{t(`${plan}.popular`)}
										</div>
									)}
									<CardHeader className='pb-4'>
										<CardTitle className='text-xl'>{t(`${plan}.name`)}</CardTitle>
										<div className='mt-2 flex items-baseline gap-1'>
											<span className='text-3xl font-bold'>${t(`${plan}.price`)}</span>
											<span className='text-muted-foreground text-sm'>{t(`${plan}.period`)}</span>
										</div>
										<CardDescription>{t(`${plan}.description`)}</CardDescription>
									</CardHeader>
									<CardContent className='flex-1'>
										<ul className='space-y-3'>
											{(t.raw(`${plan}.features`) as string[]).map((feature) => (
												<li
													key={feature}
													className='flex items-center gap-2 text-sm'
												>
													<Check className='text-primary size-4 shrink-0' />
													{feature}
												</li>
											))}
										</ul>
									</CardContent>
									<CardFooter className='pt-6'>
										<Button
											className='w-full'
											variant={isPopular ? 'default' : 'outline'}
										>
											{t(`${plan}.cta`)}
										</Button>
									</CardFooter>
								</Card>
							)
						})}
					</div>
				</div>
			</main>
		</div>
	)
}
