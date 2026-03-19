'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const pathname = usePathname()
	const isRomanian = pathname?.startsWith('/ro')
	const copy = isRomanian
		? {
				lang: 'ro',
				title: 'Ceva nu a mers bine',
				description: 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.',
				button: 'Încearcă din nou'
			}
		: {
				lang: 'en',
				title: 'Something went wrong',
				description: 'An unexpected error occurred. Please try again.',
				button: 'Try again'
			}

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<html lang={copy.lang}>
			<body className='bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6 p-6'>
				<h1 className='text-2xl font-semibold'>{copy.title}</h1>
				<p className='text-muted-foreground max-w-sm text-center'>{copy.description}</p>
				<Button onClick={reset}>{copy.button}</Button>
			</body>
		</html>
	)
}
