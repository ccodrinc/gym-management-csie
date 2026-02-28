import { setRequestLocale } from 'next-intl/server'

import { ClassBookButton } from '@/components/class-book-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/motion'
import { getClasses } from '@/lib/data'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberClassesPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)
	const classes = await getClasses()

	return (
		<FadeIn className='space-y-6'>
			<div>
				<h1 className='text-foreground text-2xl font-semibold tracking-tight'>Classes</h1>
				<p className='text-muted-foreground text-sm'>View and book group classes</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>This Week&apos;s Schedule</CardTitle>
					<CardDescription>Drop-in classes included with your membership</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{classes.map((cls) => (
							<div
								key={cls.id}
								className='flex items-center justify-between rounded-md border px-4 py-3'
							>
								<div>
									<p className='font-medium'>{cls.name}</p>
									<p className='text-muted-foreground text-sm'>
										{cls.day} · {cls.time}
									</p>
								</div>
								<div className='text-right'>
									<p className='text-sm'>
										{cls.spots}/{cls.maxSpots} spots
									</p>
									<ClassBookButton />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
