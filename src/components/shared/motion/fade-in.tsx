'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

type FadeInProps = {
	children: React.ReactNode
	className?: string
	delay?: number
	as?: 'div' | 'section' | 'article' | 'main' | 'footer' | 'header'
}

export function FadeIn({ children, className, delay = 0, as: Tag = 'div' }: FadeInProps) {
	const shouldReduceMotion = useReducedMotion()
	const MotionTag = motion[Tag] as typeof motion.div

	if (shouldReduceMotion) {
		return <Tag className={cn(className)}>{children}</Tag>
	}

	return (
		<MotionTag
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.55, delay, ease: EASE }}
			className={cn(className)}
		>
			{children}
		</MotionTag>
	)
}
