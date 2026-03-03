import { Loader2 } from 'lucide-react'

export default function PrivateLoading() {
	return (
		<div className='flex flex-1 items-center justify-center p-6'>
			<Loader2 className='text-muted-foreground size-10 animate-spin' />
		</div>
	)
}
