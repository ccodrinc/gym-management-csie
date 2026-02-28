'use client'

import { motion } from 'framer-motion'

import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

type FadeInViewProps = {
	children: React.ReactNode
	className?: string
	delay?: number
	as?: 'div' | 'section' | 'article'
	id?: string
}

export function FadeInView({ children, className, delay = 0, as: Tag = 'div', id }: FadeInViewProps) {
	const MotionTag = motion[Tag] as typeof motion.div

	return (
		<MotionTag
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-60px', amount: 0.2 }}
			transition={{
				duration: 0.55,
				delay,
				ease: EASE
			}}
			className={cn(className)}
			id={id}
		>
			{children}
		</MotionTag>
	)
}
