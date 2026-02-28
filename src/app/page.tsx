import { Dumbbell, Clock, Users } from 'lucide-react'
import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
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
					<nav className='hidden gap-8 md:flex'>
						<a
							href='#amenities'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Classes
						</a>
						<a
							href='#cta'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Memberships
						</a>
					</nav>
					<div className='flex items-center gap-2'>
						<ThemeToggle />
						<Button
							size='sm'
							variant='outline'
							className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5'
						>
							Log in
						</Button>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				{/* Hero - left-aligned, asymmetric */}
				<section className='relative overflow-hidden'>
					<div className='bg-primary/20 absolute top-0 -right-32 h-96 w-96 rounded-full blur-3xl' />
					<div className='bg-primary/10 absolute top-48 -left-32 h-64 w-64 rounded-full blur-3xl' />
					<div className='relative mx-auto max-w-6xl px-6 pt-28 pb-36 md:pt-40 md:pb-48'>
						<div className='max-w-2xl'>
							<p className='text-primary mb-6 font-mono text-sm'>Downtown • Open 24/7</p>
							<h1 className='text-foreground font-sans text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl'>
								Train hard. Recover harder.
							</h1>
							<p className='text-muted-foreground mt-6 text-lg leading-relaxed'>
								Full weights floor, turf zone, and group classes. No contract. Walk in anytime.
							</p>
							<div className='mt-10 flex gap-3'>
								<Button
									size='lg'
									className='px-8'
								>
									Get a day pass
								</Button>
								<Button
									size='lg'
									variant='ghost'
									className='text-muted-foreground hover:text-foreground'
								>
									View class schedule
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Features - asymmetric grid */}
				<section
					id='amenities'
					className='border-border bg-muted/30 border-t py-24'
				>
					<div className='mx-auto max-w-6xl px-6'>
						<h2 className='mb-16 font-sans text-3xl font-semibold tracking-tight md:text-4xl'>What we&apos;ve got</h2>
						<div className='grid gap-6 md:grid-cols-2 md:gap-8'>
							<Card className='border-border bg-card md:col-span-2 lg:col-span-1'>
								<CardHeader>
									<Clock
										className='text-primary mb-3 size-8'
										strokeWidth={1.5}
									/>
									<CardTitle className='text-xl'>24/7 access</CardTitle>
									<CardDescription>
										Early morning, late night, doesn&apos;t matter. Swipe in whenever. Members get key fob access round
										the clock.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className='border-border bg-card'>
								<CardHeader>
									<Dumbbell
										className='text-primary mb-3 size-8'
										strokeWidth={1.5}
									/>
									<CardTitle className='text-xl'>Full weights floor</CardTitle>
									<CardDescription>
										Squat racks, benches, dumbbells up to 120. Deadlift platform. Turf for sled work and carries.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className='border-primary/20 bg-primary/5'>
								<CardHeader>
									<Users
										className='text-primary mb-3 size-8'
										strokeWidth={1.5}
									/>
									<CardTitle className='text-xl'>Group classes</CardTitle>
									<CardDescription>
										HIIT, strength, mobility. Included in membership. Book your spot in the app.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>

				{/* CTA - minimal */}
				<section className='border-border border-t py-24'>
					<div className='mx-auto max-w-6xl px-6'>
						<div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
							<div>
								<h3 className='font-sans text-2xl font-semibold tracking-tight'>First visit free.</h3>
								<p className='text-muted-foreground mt-2'>
									Drop by for a tour. No pressure. We&apos;ll get you set up if you want to join.
								</p>
							</div>
							<Button
								size='lg'
								className='shrink-0 px-8'
							>
								Book a visit
							</Button>
						</div>
					</div>
				</section>
			</main>

			<footer className='border-border border-t py-8'>
				<div className='mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between'>
					<p className='text-muted-foreground text-sm'>© Reps</p>
					<div className='flex gap-6'>
						<a
							href='#'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Privacy
						</a>
						<a
							href='#'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Terms
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}
