import { cn } from '@/lib/utils'

type PageHeaderProps = {
	title: string
	description?: string
	className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
	return (
		<header className={cn('flex min-w-0 flex-col gap-1', className)}>
			<h1 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>{title}</h1>
			{description ? <p className='text-muted-foreground max-w-3xl text-sm leading-6'>{description}</p> : null}
		</header>
	)
}
