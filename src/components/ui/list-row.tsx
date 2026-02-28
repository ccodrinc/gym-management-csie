import { cn } from '@/lib/utils'

type ListRowProps = {
	children: React.ReactNode
	className?: string
}

export function ListRow({ children, className }: ListRowProps) {
	return (
		<li
			className={cn(
				'flex items-center justify-between rounded-md border px-4 py-2 text-sm',
				className
			)}
		>
			{children}
		</li>
	)
}
