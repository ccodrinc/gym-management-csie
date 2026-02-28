'use client'

import { motion } from 'framer-motion'

import { EASE } from '@/lib/motion'

function AnimatedLink({
	href,
	children,
	className,
	target,
	rel
}: {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	rel?: string
}) {
	return (
		<motion.a
			href={href}
			className={className}
			target={target}
			rel={rel}
			whileHover={{ y: -1 }}
			transition={{ duration: 0.2, ease: EASE }}
		>
			{children}
		</motion.a>
	)
}

export function FooterNavLink(props: { href: string; children: React.ReactNode }) {
	return (
		<AnimatedLink
			{...props}
			className='text-muted-foreground hover:text-foreground text-sm transition-colors'
		/>
	)
}

export function FooterNavGitHubLink(props: { href: string; children: React.ReactNode }) {
	return (
		<AnimatedLink
			{...props}
			className='text-primary hover:underline'
			target='_blank'
			rel='noopener noreferrer'
		/>
	)
}
