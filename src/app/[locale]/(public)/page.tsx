import { Clock, Dumbbell, ShieldPlus, Users } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { FadeIn } from '@/components/shared/motion/fade-in'
import { FadeInView } from '@/components/shared/motion/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion/stagger'
import { StructuredData } from '@/components/shared/structured-data'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createPageMetadata } from '@/lib/seo'
import { PUBLIC_PAGE_IMAGES } from '@/lib/public-images'
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

type Props = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })

	return createPageMetadata({
		locale,
		pathname: '/',
		title: t('title'),
		description: t('description')
	})
}

export default async function HomePage({ params }: Props) {
	const { locale } = await params

	const t = await getTranslations({ locale })
	const amenities = [
		{
			key: 'access24',
			Icon: Clock,
			image: PUBLIC_PAGE_IMAGES.amenities.access24,
			cardClassName: 'border-border bg-card'
		},
		{
			key: 'weightsFloor',
			Icon: Dumbbell,
			image: PUBLIC_PAGE_IMAGES.amenities.weightsFloor,
			cardClassName: 'border-border bg-card'
		},
		{
			key: 'groupClasses',
			Icon: Users,
			image: PUBLIC_PAGE_IMAGES.amenities.groupClasses,
			cardClassName: 'border-primary/20 bg-primary/5'
		},
		{
			key: 'recoveryZone',
			Icon: ShieldPlus,
			image: PUBLIC_PAGE_IMAGES.amenities.recoveryZone,
			cardClassName: 'border-border bg-card'
		}
	] as const
	const websiteUrl = getSiteUrl()
	const homeJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'HealthClub',
		name: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: websiteUrl,
		areaServed: locale === 'ro' ? 'Romania' : 'Europe',
		availableLanguage: ['en', 'ro'],
		openingHours: 'Mo-Su 00:00-23:59'
	}

	return (
		<>
			<StructuredData data={homeJsonLd} />
			<section className='relative isolate overflow-hidden border-b bg-neutral-950 text-white'>
				<Image
					src={PUBLIC_PAGE_IMAGES.homeHero}
					alt=''
					fill
					priority
					sizes='100vw'
					className='object-cover opacity-85'
				/>
				<div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,5,0.86)_0%,rgba(3,8,5,0.58)_48%,rgba(3,8,5,0.16)_100%)]' />
				<div className='from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t via-transparent to-transparent' />
				<div className='relative mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-40'>
					<div className='max-w-3xl'>
						<FadeIn delay={0}>
							<p className='mb-6 font-mono text-sm text-emerald-200/90'>{t('Hero.badge')}</p>
						</FadeIn>
						<FadeIn delay={0.1}>
							<h1 className='font-sans text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl'>
								{t('Hero.headline')}
							</h1>
						</FadeIn>
						<FadeIn delay={0.25}>
							<p className='mt-6 max-w-2xl text-lg leading-relaxed text-white/80'>{t('Hero.subheadline')}</p>
						</FadeIn>
						<FadeIn delay={0.4}>
							<div className='mt-10 flex flex-col items-start gap-3 sm:flex-row'>
								<Button
									size='lg'
									className='w-full bg-white px-8 text-neutral-950 shadow-lg shadow-black/20 hover:bg-white/90 sm:w-auto'
									asChild
								>
									<Link
										href='/pricing'
										locale={locale}
									>
										{t('Hero.getDayPass')}
									</Link>
								</Button>
								<Button
									size='lg'
									variant='ghost'
									className='w-full justify-start border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto sm:justify-center'
									asChild
								>
									<Link
										href='/member/classes'
										locale={locale}
									>
										{t('Hero.viewSchedule')}
									</Link>
								</Button>
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
						{amenities.map(({ key, Icon, image, cardClassName }) => (
							<StaggerItem
								key={key}
								hover
							>
								<Card className={`group h-full overflow-hidden py-0 ${cardClassName}`}>
									<div className='relative aspect-[16/10] overflow-hidden'>
										<Image
											src={image}
											alt=''
											fill
											sizes='(min-width: 768px) 50vw, 100vw'
											className='object-cover transition duration-700 group-hover:scale-105'
										/>
										<div className='absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent' />
									</div>
									<CardHeader className='p-6'>
										<Icon
											className='text-primary mb-3 size-8'
											strokeWidth={1.5}
										/>
										<CardTitle className='text-xl'>{t(`Amenities.${key}.title`)}</CardTitle>
										<CardDescription>{t(`Amenities.${key}.description`)}</CardDescription>
									</CardHeader>
								</Card>
							</StaggerItem>
						))}
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
							<Button
								size='lg'
								className='shrink-0 px-8'
								asChild
							>
								<Link
									href='/signup'
									locale={locale}
								>
									{t('CTA.button')}
								</Link>
							</Button>
						</FadeInView>
					</div>
				</div>
			</section>
		</>
	)
}
