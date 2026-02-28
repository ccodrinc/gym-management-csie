'use client'

import { motion } from 'framer-motion'

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
		transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
	}
}

type StaggerContainerProps = {
	children: React.ReactNode
	className?: string
	as?: 'div' | 'ul' | 'section'
}

export function StaggerContainer({ children, className, as: Tag = 'div' }: StaggerContainerProps) {
	const MotionTag = motion[Tag] as typeof motion.div

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

export function StaggerItem({ children, className, as: Tag = 'div', hover }: StaggerItemProps) {
	const MotionTag = motion[Tag] as typeof motion.div

	return (
		<MotionTag
			variants={itemVariants}
			className={cn(className)}
			whileHover={hover ? { y: -6, transition: { duration: 0.2 } } : undefined}
			whileTap={hover ? { scale: 0.98 } : undefined}
		>
			{children}
		</MotionTag>
	)
}
