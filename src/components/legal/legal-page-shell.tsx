import { FileText, GraduationCap, ShieldCheck } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type LegalSection = {
	title: string
	body: string
	points?: string[]
}

type LegalPageShellProps = {
	title: string
	description: string
	disclaimer: string
	summaryTitle: string
	summaryBody: string
	sections: LegalSection[]
	variant: 'privacy' | 'terms'
}

export function LegalPageShell({
	title,
	description,
	disclaimer,
	summaryTitle,
	summaryBody,
	sections,
	variant
}: LegalPageShellProps) {
	const Icon = variant === 'privacy' ? ShieldCheck : FileText

	return (
		<div className='relative overflow-hidden px-6 py-20'>
			<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(64,153,92,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(64,153,92,0.1),transparent_32%)]' />
			<div className='relative mx-auto max-w-7xl space-y-8'>
				<section className='mx-auto max-w-6xl space-y-6 rounded-[2rem] border bg-gradient-to-br from-card via-card to-muted/40 p-8 shadow-sm md:p-12'>
					<div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start'>
						<div className='max-w-3xl space-y-4'>
							<div className='flex items-center gap-3'>
								<div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl'>
									<Icon className='size-6' />
								</div>
								<h1 className='text-4xl font-semibold tracking-tight md:text-5xl'>{title}</h1>
							</div>
							<p className='text-muted-foreground max-w-3xl text-lg leading-8'>{description}</p>
						</div>

						<Card className='w-full border-primary/20 bg-background/80 shadow-none'>
							<CardHeader className='space-y-3'>
								<div className='flex items-center gap-2 text-sm font-medium'>
									<GraduationCap className='size-4 text-primary' />
									{summaryTitle}
								</div>
								<CardDescription className='text-sm leading-6'>{summaryBody}</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</section>

				<Card className='mx-auto max-w-6xl border-primary/15 bg-muted/30'>
					<CardContent className='p-6 md:p-7'>
						<p className='text-sm leading-7'>{disclaimer}</p>
					</CardContent>
				</Card>

				<div className='mx-auto grid max-w-6xl gap-5'>
					{sections.map((section) => (
						<Card
							key={section.title}
							className='rounded-[1.5rem] border bg-card/95'
						>
							<CardHeader>
								<CardTitle className='text-xl'>{section.title}</CardTitle>
								<CardDescription className='text-base leading-7 text-foreground/80'>
									{section.body}
								</CardDescription>
							</CardHeader>
							{section.points && section.points.length > 0 ? (
								<CardContent>
									<ul className='grid gap-3'>
										{section.points.map((point) => (
											<li
												key={point}
												className='text-muted-foreground flex gap-3 text-sm leading-6'
											>
												<span className='bg-primary mt-2 size-1.5 shrink-0 rounded-full' />
												<span>{point}</span>
											</li>
										))}
									</ul>
								</CardContent>
							) : null}
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}
