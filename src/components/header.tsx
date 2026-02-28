import { Dumbbell } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { LanguageSelect } from '@/components/language-select'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export async function Header() {
	const t = await getTranslations('Header')

	return (
		<header className='border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl'>
			<div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
				<Link
					href='/'
					className='text-primary flex items-center gap-2 font-semibold tracking-tight'
				>
					<Dumbbell
						className='size-5'
						strokeWidth={2}
					/>
					{t('brand')}
				</Link>
				<nav className='hidden gap-8 md:flex'>
					<Link
						href='/'
						className='text-muted-foreground hover:text-foreground text-sm transition-colors'
					>
						{t('home')}
					</Link>
					<Link
						href='/pricing'
						className='text-muted-foreground hover:text-foreground text-sm transition-colors'
					>
						{t('memberships')}
					</Link>
				</nav>
				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<LanguageSelect />
					<Button
						asChild
						size='sm'
						variant='outline'
						className='border-foreground/20 text-foreground hover:border-primary hover:bg-primary/5'
					>
						<Link href='/login'>{t('logIn')}</Link>
					</Button>
				</div>
			</div>
		</header>
	)
}
