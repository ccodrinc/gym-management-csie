'use client'

import { motion } from 'framer-motion'

import { Link, usePathname } from '@/i18n/navigation'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

type NavLinkProps = {
	href: string
	children: React.ReactNode
	className?: string
}

export function AnimatedNavLink({ href, children, className }: NavLinkProps) {
	const pathname = usePathname()
	const active = pathname === href || (href !== '/' && pathname.startsWith(href))

	return (
		<motion.div
			whileHover={{ y: -1 }}
			transition={{ duration: 0.2, ease: EASE }}
			className='inline-block'
		>
			<Link
				href={href}
				className={cn(
					'text-muted-foreground hover:text-foreground relative text-sm transition-colors',
					active && 'text-foreground',
					className
				)}
			>
				{children}
				{active && (
					<motion.span
						className='bg-primary absolute -bottom-1 left-0 h-px w-full'
						layoutId='nav-underline'
						transition={{ duration: 0.25, ease: EASE }}
					/>
				)}
			</Link>
		</motion.div>
	)
}
