export default function AuthLoading() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12'>
			<div className='bg-muted size-10 animate-pulse rounded-lg' />
			<div className='flex flex-col items-center gap-2'>
				<div className='bg-muted h-8 w-64 animate-pulse rounded' />
				<div className='bg-muted h-4 w-48 animate-pulse rounded' />
			</div>
		</div>
	)
}
