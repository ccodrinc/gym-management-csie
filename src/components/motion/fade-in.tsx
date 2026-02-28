'use client'

import { motion } from 'framer-motion'

import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

const defaultVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: EASE }
	}
}

type FadeInProps = {
	children: React.ReactNode
	className?: string
	delay?: number
	as?: 'div' | 'section' | 'article' | 'main' | 'footer' | 'header'
}

export function FadeIn({ children, className, delay = 0, as: Tag = 'div' }: FadeInProps) {
	const MotionTag = motion[Tag] as typeof motion.div

	return (
		<MotionTag
			initial='hidden'
			animate='visible'
			variants={{
				...defaultVariants,
				visible: {
					...defaultVariants.visible,
					transition: {
						...defaultVariants.visible.transition,
						delay
					}
				}
			}}
			className={cn(className)}
		>
			{children}
		</MotionTag>
	)
}
