import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FadeIn } from '@/components/motion'

export default async function PublicLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	return (
		<div className='flex min-h-screen flex-col'>
			<FadeIn>
				<Header locale={locale} />
			</FadeIn>
			<main className='flex-1'>{children}</main>
			<FadeIn>
				<Footer locale={locale} />
			</FadeIn>
		</div>
	)
}
