import Image from 'next/image'

import { cn } from '@/lib/utils'

type BrandMarkProps = {
	className?: string
	size?: number
	priority?: boolean
}

export function BrandMark({ className, size = 22, priority = false }: BrandMarkProps) {
	return (
		<Image
			src='/android-chrome-192x192.png'
			alt='Reps'
			width={size}
			height={size}
			priority={priority}
			className={cn('shrink-0 rounded-[6px]', className)}
		/>
	)
}
