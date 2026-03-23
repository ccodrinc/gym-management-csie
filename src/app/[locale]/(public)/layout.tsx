import { SiteFooter } from '@/app/[locale]/(public)/_components/site-footer'
import { SiteHeader } from '@/app/[locale]/(public)/_components/site-header'

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
			<SiteHeader locale={locale} />
			<main
				id='main-content'
				className='flex-1'
			>
				{children}
			</main>
			<SiteFooter locale={locale} />
		</div>
	)
}
