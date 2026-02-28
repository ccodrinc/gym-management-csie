'use client'

import { ErrorFallback } from '@/components/error-fallback'

export default function PrivateError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<ErrorFallback
			error={error}
			reset={reset}
			className='flex flex-1 flex-col items-center justify-center gap-6 p-6'
		/>
	)
}
