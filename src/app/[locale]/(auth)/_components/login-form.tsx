'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, Link } from '@/i18n/navigation'
import { EASE } from '@/lib/motion'

const formVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.1 }
	}
} as const

const fieldVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0 }
} as const

const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		username: z.string().min(1, t('usernameRequired')),
		password: z.string().min(1, t('passwordRequired'))
	})

export function LoginForm() {
	const shouldReduceMotion = useReducedMotion()
	const t = useTranslations('Auth.login')
	const tAuth = useTranslations('Auth')
	const tValidation = useTranslations('Auth.validation')
	const searchParams = useSearchParams()
	const router = useRouter()
	const from = searchParams.get('from')

	const schema = createLoginSchema(tValidation)
	type FormValues = z.infer<typeof schema>

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: '',
			password: ''
		}
	})

	async function onSubmit(values: FormValues) {
		const result = await loginAction(values.username, values.password, from ?? undefined)
		if (result.ok) {
			router.push(result.redirectTo)
			return
		}

		form.setError('root', { message: result.error })
	}

	return (
		<motion.div
			initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
			animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: EASE }}
			className='w-full'
		>
			<Card className='mx-auto w-full max-w-lg px-8 py-8 md:max-w-2xl md:px-10'>
				<CardHeader className='flex flex-col gap-1 px-0'>
					<CardTitle className='text-2xl'>{t('title')}</CardTitle>
					<CardDescription>{t('subtitle')}</CardDescription>
				</CardHeader>

				<CardContent className='px-0 pt-2'>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col gap-5'
						variants={shouldReduceMotion ? undefined : formVariants}
						initial={shouldReduceMotion ? undefined : 'hidden'}
						animate={shouldReduceMotion ? undefined : 'visible'}
					>
						<motion.div
							className='flex flex-col gap-2'
							variants={shouldReduceMotion ? undefined : fieldVariants}
						>
							<Label htmlFor='login-username'>{t('username')}</Label>
							<Input
								id='login-username'
								type='text'
								placeholder={tAuth('placeholder.username')}
								autoComplete='username'
								autoCapitalize='none'
								spellCheck={false}
								aria-invalid={Boolean(form.formState.errors.username)}
								aria-describedby={form.formState.errors.username ? 'login-username-error' : undefined}
								{...form.register('username')}
							/>
							{form.formState.errors.username ? (
								<p
									id='login-username-error'
									className='text-destructive text-sm'
								>
									{form.formState.errors.username.message}
								</p>
							) : null}
						</motion.div>

						<motion.div
							className='flex flex-col gap-2'
							variants={shouldReduceMotion ? undefined : fieldVariants}
						>
							<Label htmlFor='login-password'>{t('password')}</Label>
							<Input
								id='login-password'
								type='password'
								autoComplete='current-password'
								aria-invalid={Boolean(form.formState.errors.password)}
								aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined}
								{...form.register('password')}
							/>
							{form.formState.errors.password ? (
								<p
									id='login-password-error'
									className='text-destructive text-sm'
								>
									{form.formState.errors.password.message}
								</p>
							) : null}
						</motion.div>

						{form.formState.errors.root ? (
							<motion.p
								role='alert'
								aria-live='polite'
								className='text-destructive text-sm'
								variants={shouldReduceMotion ? undefined : fieldVariants}
							>
								{form.formState.errors.root.message}
							</motion.p>
						) : null}

						<motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
							<Button
								type='submit'
								className='w-full'
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? t('submitPending') : t('submit')}
							</Button>
						</motion.div>

						<motion.p
							className='text-muted-foreground text-center text-sm'
							variants={shouldReduceMotion ? undefined : fieldVariants}
						>
							{t('noAccount')}{' '}
							<Link
								href='/signup'
								className='text-primary font-medium underline underline-offset-4 transition-colors hover:opacity-90'
							>
								{t('signUp')}
							</Link>
						</motion.p>
					</motion.form>
				</CardContent>
			</Card>
		</motion.div>
	)
}
