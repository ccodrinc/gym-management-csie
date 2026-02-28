import { setRequestLocale } from 'next-intl/server'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function MemberPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<div className='flex min-h-screen items-center justify-center px-6'>
			<p className='text-muted-foreground text-lg'>Member area — In progress</p>
		</div>
	)
}
