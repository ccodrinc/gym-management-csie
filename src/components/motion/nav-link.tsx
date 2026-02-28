'use client'

import { motion } from 'framer-motion'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

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
			transition={{ duration: 0.2, ease }}
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
						transition={{ duration: 0.25, ease }}
					/>
				)}
			</Link>
		</motion.div>
	)
}
