import { cn } from '@/lib/utils'

type ListRowProps = {
	children: React.ReactNode
	className?: string
}

export function ListRow({ children, className }: ListRowProps) {
	return (
		<li
			className={cn(
				'bg-card flex min-w-0 items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm',
				className
			)}
		>
			{children}
		</li>
	)
}
