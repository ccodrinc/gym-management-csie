import { Loader2 } from 'lucide-react'

export default function AuthLoading() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'>
			<Loader2
				aria-hidden='true'
				className='text-muted-foreground size-10 animate-spin'
			/>
			<span className='sr-only'>Loading…</span>
		</div>
	)
}
