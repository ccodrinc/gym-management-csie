'use client'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type PressableProps = {
	children: React.ReactNode
	className?: string
	scale?: number
	tapScale?: number
}

const ease = [0.22, 1, 0.36, 1] as const

export function Pressable({ children, className, scale = 1.03, tapScale = 0.98 }: PressableProps) {
	return (
		<motion.div
			className={cn('inline-block', className)}
			whileHover={{ scale }}
			whileTap={{ scale: tapScale }}
			transition={{ duration: 0.2, ease }}
		>
			{children}
		</motion.div>
	)
}
