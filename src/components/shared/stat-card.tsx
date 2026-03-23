import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatCardProps = {
	title: string
	value: React.ReactNode
	subtitle?: string
	badge?: React.ReactNode
	className?: string
}

export function StatCard({ title, value, subtitle, badge, className }: StatCardProps) {
	return (
		<Card className={cn(className)}>
			<CardHeader className='flex flex-row items-start justify-between gap-3 pb-2'>
				<p className='text-muted-foreground text-sm font-medium'>{title}</p>
				{badge}
			</CardHeader>
			<CardContent className='flex flex-col gap-1'>
				<div className='text-2xl font-bold tracking-tight'>{value}</div>
				{subtitle ? <p className='text-muted-foreground text-xs leading-5'>{subtitle}</p> : null}
			</CardContent>
		</Card>
	)
}
