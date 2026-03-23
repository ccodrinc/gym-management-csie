import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RootNotFound() {
	return (
		<main
			id='main-content'
			className='flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12 text-center'
		>
			<div className='flex max-w-md flex-col gap-2'>
				<p className='text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase'>Not Found</p>
				<h1 className='text-3xl font-semibold tracking-tight'>The page you requested does not exist.</h1>
				<p className='text-muted-foreground text-sm leading-6'>
					The route may have changed or the locale is unavailable.
				</p>
			</div>
			<Button asChild>
				<Link href='/'>Go home</Link>
			</Button>
		</main>
	)
}
