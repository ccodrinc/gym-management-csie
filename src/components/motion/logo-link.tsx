'use client'

import { motion } from 'framer-motion'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

type LogoLinkProps = {
	href: string
	children: React.ReactNode
	className?: string
}

export function LogoLink({ href, children, className }: LogoLinkProps) {
	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2, ease }}
			className='inline-flex'
		>
			<Link
				href={href}
				className={cn('text-primary flex items-center gap-2 font-semibold tracking-tight', className)}
			>
				{children}
			</Link>
		</motion.div>
	)
}
