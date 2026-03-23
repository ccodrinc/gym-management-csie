'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.15
		}
	}
}

const itemVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: EASE }
	}
}

type StaggerContainerProps = {
	children: React.ReactNode
	className?: string
	as?: 'div' | 'ul' | 'section'
}

export function StaggerContainer({ children, className, as: Tag = 'div' }: StaggerContainerProps) {
	const shouldReduceMotion = useReducedMotion()
	const MotionTag = motion[Tag] as typeof motion.div

	if (shouldReduceMotion) {
		return <Tag className={cn(className)}>{children}</Tag>
	}

	return (
		<MotionTag
			variants={containerVariants}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, margin: '-30px' }}
			className={cn(className)}
		>
			{children}
		</MotionTag>
	)
}

type StaggerItemProps = {
	children: React.ReactNode
	className?: string
	as?: 'div' | 'li' | 'article'
	hover?: boolean
}

export function StaggerItem({ children, className, as: Tag = 'div', hover = false }: StaggerItemProps) {
	const shouldReduceMotion = useReducedMotion()
	const MotionTag = motion[Tag] as typeof motion.div

	return (
		<MotionTag
			variants={shouldReduceMotion ? undefined : itemVariants}
			className={cn(className)}
			whileHover={hover && !shouldReduceMotion ? { y: -4 } : undefined}
			whileTap={hover && !shouldReduceMotion ? { scale: 0.99 } : undefined}
			transition={{ duration: 0.2, ease: EASE }}
		>
			{children}
		</MotionTag>
	)
}
