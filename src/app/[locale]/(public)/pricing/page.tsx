import { Check } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { FadeInView } from '@/components/shared/motion/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion/stagger'
import { StructuredData } from '@/components/shared/structured-data'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { PUBLIC_PAGE_IMAGES } from '@/lib/public-images'
import { createPageMetadata, getLocalizedUrl } from '@/lib/seo'
import { getSiteUrl, SITE_NAME } from '@/lib/site'

type Props = {
	params: Promise<{ locale: string }>
}

const plans = ['dayPass', 'monthly', 'annual'] as const
const planImages = {
	dayPass: PUBLIC_PAGE_IMAGES.plans.dayPass,
	monthly: PUBLIC_PAGE_IMAGES.plans.monthly,
	annual: PUBLIC_PAGE_IMAGES.plans.annual
} satisfies Record<(typeof plans)[number], string>

export async function generateMetadata({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Pricing' })

	return createPageMetadata({
		locale,
		pathname: '/pricing',
		title: t('title'),
		description: t('subtitle')
	})
}

export default async function PricingPage({ params }: Props) {
	const { locale } = await params

	const t = await getTranslations({ locale, namespace: 'Pricing' })

	const pricingJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'OfferCatalog',
		name: `${SITE_NAME} Membership Plans`,
		url: getLocalizedUrl('/pricing', locale),
		itemListElement: plans.map((plan) => ({
			'@type': 'Offer',
			name: t(`${plan}.name`),
			description: t(`${plan}.description`),
			price: Number(t(`${plan}.price`)),
			priceCurrency: 'USD',
			url: new URL(`/${locale}/signup?plan=${plan}`, getSiteUrl()).toString()
		}))
	}

	return (
		<>
			<StructuredData data={pricingJsonLd} />
			<section className='relative isolate overflow-hidden border-b bg-neutral-950 px-6 py-24 text-white md:py-28'>
				<Image
					src={PUBLIC_PAGE_IMAGES.pricingHero}
					alt=''
					fill
					priority
					sizes='100vw'
					className='object-cover opacity-75'
				/>
				<div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,5,0.88)_0%,rgba(3,8,5,0.58)_50%,rgba(3,8,5,0.18)_100%)]' />
				<FadeInView className='relative mx-auto max-w-6xl'>
					<div className='max-w-3xl'>
						<h1 className='font-sans text-4xl font-semibold tracking-tight text-white md:text-5xl'>{t('title')}</h1>
						<p className='mt-4 max-w-2xl text-lg text-white/75'>{t('subtitle')}</p>
					</div>
				</FadeInView>
			</section>

			<section className='px-6 py-20 md:py-24'>
				<div className='mx-auto max-w-6xl'>
					<StaggerContainer className='grid gap-8 md:grid-cols-3'>
						{plans.map((plan) => {
							const isPopular = plan === 'monthly'
							return (
								<StaggerItem
									key={plan}
									hover
								>
									<Card
										className={`relative flex h-full flex-col gap-0 overflow-hidden py-0 ${
											isPopular ? 'border-primary/50 bg-primary/5 shadow-lg' : 'border-border bg-card'
										}`}
									>
										{isPopular && (
											<div className='bg-primary text-primary-foreground absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium shadow-sm'>
												{t(`${plan}.popular`)}
											</div>
										)}
										<div className='relative aspect-[4/3] overflow-hidden'>
											<Image
												src={planImages[plan]}
												alt=''
												fill
												sizes='(min-width: 768px) 33vw, 100vw'
												className='object-cover'
											/>
											<div className='absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent' />
										</div>
										<CardHeader className='p-6 pb-4'>
											<CardTitle className='text-xl'>{t(`${plan}.name`)}</CardTitle>
											<div className='mt-2 flex items-baseline gap-1'>
												<span className='text-3xl font-bold'>{formatCurrency(Number(t(`${plan}.price`)), locale)}</span>
												<span className='text-muted-foreground text-sm'>{t(`${plan}.period`)}</span>
											</div>
											<CardDescription>{t(`${plan}.description`)}</CardDescription>
										</CardHeader>
										<CardContent className='flex-1 px-6'>
											<ul className='flex flex-col gap-3'>
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
										<CardFooter className='px-6 pt-6 pb-6'>
											<Button
												className='w-full'
												variant={isPopular ? 'default' : 'outline'}
												asChild
											>
												<Link
													href={`/signup?plan=${plan}`}
													locale={locale}
												>
													{t(`${plan}.cta`)}
												</Link>
											</Button>
										</CardFooter>
									</Card>
								</StaggerItem>
							)
						})}
					</StaggerContainer>
				</div>
			</section>
		</>
	)
}
