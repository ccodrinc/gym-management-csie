export default function PrivateLoading() {
	return (
		<div className='flex flex-1 items-center justify-center p-6'>
			<div className='flex flex-col items-center gap-4'>
				<div className='bg-muted size-12 animate-pulse rounded-xl' />
				<div className='flex gap-2'>
					<div className='bg-muted h-4 w-24 animate-pulse rounded' />
					<div className='bg-muted h-4 w-32 animate-pulse rounded' />
					<div className='bg-muted h-4 w-20 animate-pulse rounded' />
				</div>
			</div>
		</div>
	)
}
