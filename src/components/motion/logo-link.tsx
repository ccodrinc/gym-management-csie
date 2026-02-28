'use client'

import { motion } from 'framer-motion'

import { Link } from '@/i18n/navigation'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

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
			transition={{ duration: 0.2, ease: EASE }}
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
