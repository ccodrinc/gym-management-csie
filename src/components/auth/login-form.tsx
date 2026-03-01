'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'

import { loginAction } from '@/app/actions/auth'
import { authFieldVariants, authFormVariants } from '@/components/auth/form-variants'
import { Pressable } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EASE } from '@/lib/motion'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		username: z.string().min(1, t('usernameRequired')),
		password: z.string().min(1, t('passwordRequired'))
	})

export function LoginForm() {
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
		} else {
			form.setError('root', { message: result.error })
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: EASE }}
		>
			<Card className='w-full max-w-lg'>
				<CardHeader className='space-y-1'>
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.4 }}
					>
						<CardTitle className='text-2xl'>{t('title')}</CardTitle>
						<CardDescription>{t('subtitle')}</CardDescription>
					</motion.div>
				</CardHeader>
				<CardContent>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
						variants={authFormVariants}
						initial='hidden'
						animate='visible'
					>
						<motion.div
							className='space-y-2'
							variants={authFieldVariants}
						>
							<Label htmlFor='login-username'>{t('username')}</Label>
							<Input
								id='login-username'
								type='text'
								placeholder={tAuth('placeholder.username')}
								autoComplete='username'
								{...form.register('username')}
							/>
							{form.formState.errors.username && (
								<p className='text-destructive text-sm'>{form.formState.errors.username.message}</p>
							)}
						</motion.div>
						{form.formState.errors.root && (
							<p className='text-destructive text-sm'>{form.formState.errors.root.message}</p>
						)}
						<motion.div
							className='space-y-2'
							variants={authFieldVariants}
						>
							<Label htmlFor='login-password'>{t('password')}</Label>
							<Input
								id='login-password'
								type='password'
								autoComplete='current-password'
								{...form.register('password')}
							/>
							{form.formState.errors.password && (
								<p className='text-destructive text-sm'>{form.formState.errors.password.message}</p>
							)}
						</motion.div>
						<motion.div variants={authFieldVariants}>
							<Pressable className='w-full'>
								<Button
									type='submit'
									className='w-full'
								>
									{t('submit')}
								</Button>
							</Pressable>
						</motion.div>
						<motion.p
							className='text-muted-foreground text-center text-sm'
							variants={authFieldVariants}
						>
							{t('noAccount')}{' '}
							<motion.span
								whileHover={{ y: -1 }}
								className='inline-block'
							>
								<Link
									href='/signup'
									className='text-primary font-medium underline underline-offset-4 hover:no-underline'
								>
									{t('signUp')}
								</Link>
							</motion.span>
						</motion.p>
					</motion.form>
				</CardContent>
			</Card>
		</motion.div>
	)
}
