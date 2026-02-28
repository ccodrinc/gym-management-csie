import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FadeIn } from '@/components/motion'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<FadeIn>
				<Header />
			</FadeIn>
			<main className='flex-1'>{children}</main>
			<FadeIn>
				<Footer />
			</FadeIn>
		</div>
	)
}
