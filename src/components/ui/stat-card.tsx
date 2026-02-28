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
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<p className='text-muted-foreground text-sm font-medium'>{title}</p>
				{badge}
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{value}</div>
				{subtitle && (
					<p className='text-muted-foreground text-xs'>{subtitle}</p>
				)}
			</CardContent>
		</Card>
	)
}
