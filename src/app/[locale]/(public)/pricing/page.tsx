import { Check } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { FadeInView } from '@/components/shared/motion/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/shared/motion/stagger'
import { StructuredData } from '@/components/shared/structured-data'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { createPageMetadata, getLocalizedUrl } from '@/lib/seo'
import { getSiteUrl, SITE_NAME } from '@/lib/site'

type Props = {
	params: Promise<{ locale: string }>
}

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

	const plans = ['dayPass', 'monthly', 'annual'] as const
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
		<div className='px-6 py-24'>
			<StructuredData data={pricingJsonLd} />
			<div className='mx-auto max-w-6xl'>
				<FadeInView className='mb-16 text-center'>
					<h1 className='text-foreground font-sans text-4xl font-semibold tracking-tight md:text-5xl'>{t('title')}</h1>
					<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>{t('subtitle')}</p>
				</FadeInView>

				<StaggerContainer className='grid gap-8 md:grid-cols-3'>
					{plans.map((plan) => {
						const isPopular = plan === 'monthly'
						return (
							<StaggerItem
								key={plan}
								hover
							>
								<Card
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
											<span className='text-3xl font-bold'>{formatCurrency(Number(t(`${plan}.price`)), locale)}</span>
											<span className='text-muted-foreground text-sm'>{t(`${plan}.period`)}</span>
										</div>
										<CardDescription>{t(`${plan}.description`)}</CardDescription>
									</CardHeader>
									<CardContent className='flex-1'>
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
									<CardFooter className='pt-6'>
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
		</div>
	)
}
