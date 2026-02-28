'use client'

import { motion } from 'framer-motion'

import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

type PressableProps = {
	children: React.ReactNode
	className?: string
	scale?: number
	tapScale?: number
}

export function Pressable({ children, className, scale = 1.03, tapScale = 0.98 }: PressableProps) {
	return (
		<motion.div
			className={cn('inline-block', className)}
			whileHover={{ scale }}
			whileTap={{ scale: tapScale }}
			transition={{ duration: 0.2, ease: EASE }}
		>
			{children}
		</motion.div>
	)
}
