'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<html lang='en'>
			<body className='bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6 p-6'>
				<h1 className='text-2xl font-semibold'>Something went wrong</h1>
				<p className='text-muted-foreground max-w-sm text-center'>An unexpected error occurred. Please try again.</p>
				<Button onClick={reset}>Try again</Button>
			</body>
		</html>
	)
}
