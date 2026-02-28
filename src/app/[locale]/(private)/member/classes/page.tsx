import { setRequestLocale } from 'next-intl/server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/motion'

const MOCK_CLASSES = [
	{ id: '1', name: 'HIIT', day: 'Mon', time: '08:00', spots: 12, maxSpots: 20 },
	{ id: '2', name: 'Strength', day: 'Tue', time: '09:30', spots: 5, maxSpots: 16 },
	{ id: '3', name: 'Mobility', day: 'Wed', time: '18:00', spots: 18, maxSpots: 20 },
	{ id: '4', name: 'HIIT', day: 'Thu', time: '08:00', spots: 8, maxSpots: 20 },
	{ id: '5', name: 'Strength', day: 'Fri', time: '17:30', spots: 3, maxSpots: 16 }
]

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberClassesPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

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
						{MOCK_CLASSES.map((cls) => (
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
									<button
										type='button'
										className='text-primary mt-1 text-sm font-medium hover:underline'
									>
										Book
									</button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
