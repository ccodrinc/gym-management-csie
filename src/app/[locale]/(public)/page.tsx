import { Clock, Dumbbell, Users } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { FadeIn, FadeInView, Pressable, StaggerContainer, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	const t = await getTranslations()

	return (
		<>
			<section className='relative overflow-hidden'>
				<div className='bg-primary/20 absolute top-0 -right-32 h-96 w-96 rounded-full blur-3xl' />
				<div className='bg-primary/10 absolute top-48 -left-32 h-64 w-64 rounded-full blur-3xl' />
				<div className='relative mx-auto max-w-6xl px-6 pt-28 pb-36 md:pt-40 md:pb-48'>
					<div className='max-w-2xl space-y-0'>
						<FadeIn delay={0}>
							<p className='text-primary mb-6 font-mono text-sm'>{t('Hero.badge')}</p>
						</FadeIn>
						<FadeIn delay={0.1}>
							<h1 className='text-foreground font-sans text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl'>
								{t('Hero.headline')}
							</h1>
						</FadeIn>
						<FadeIn delay={0.25}>
							<p className='text-muted-foreground mt-6 text-lg leading-relaxed'>{t('Hero.subheadline')}</p>
						</FadeIn>
						<FadeIn delay={0.4}>
							<div className='mt-10 flex gap-3'>
								<Pressable>
									<Button
										size='lg'
										className='px-8'
									>
										{t('Hero.getDayPass')}
									</Button>
								</Pressable>
								<Pressable>
									<Button
										size='lg'
										variant='ghost'
										className='text-muted-foreground hover:text-foreground'
									>
										{t('Hero.viewSchedule')}
									</Button>
								</Pressable>
							</div>
						</FadeIn>
					</div>
				</div>
			</section>

			<FadeInView
				as='section'
				id='amenities'
				className='border-border bg-muted/30 border-t py-24'
			>
				<div className='mx-auto max-w-6xl px-6'>
					<FadeInView
						delay={0.1}
						as='div'
						className='mb-16'
					>
						<h2 className='font-sans text-3xl font-semibold tracking-tight md:text-4xl'>{t('Amenities.title')}</h2>
					</FadeInView>
					<StaggerContainer
						className='grid gap-6 md:grid-cols-2 md:gap-8'
						as='div'
					>
						<StaggerItem hover>
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
						</StaggerItem>
						<StaggerItem hover>
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
						</StaggerItem>
						<StaggerItem hover>
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
						</StaggerItem>
					</StaggerContainer>
				</div>
			</FadeInView>

			<section className='border-border border-t py-24'>
				<div className='mx-auto max-w-6xl px-6'>
					<div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
						<FadeInView
							delay={0}
							as='div'
						>
							<h3 className='font-sans text-2xl font-semibold tracking-tight'>{t('CTA.title')}</h3>
							<p className='text-muted-foreground mt-2'>{t('CTA.description')}</p>
						</FadeInView>
						<FadeInView
							delay={0.15}
							as='div'
						>
							<Pressable>
								<Button
									size='lg'
									className='shrink-0 px-8'
								>
									{t('CTA.button')}
								</Button>
							</Pressable>
						</FadeInView>
					</div>
				</div>
			</section>
		</>
	)
}
