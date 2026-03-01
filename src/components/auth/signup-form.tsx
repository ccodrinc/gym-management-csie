'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { authFieldVariants, authFormVariants } from '@/components/auth/form-variants'
import { Pressable } from '@/components/motion'
import { EASE } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from '@/i18n/navigation'
import { signupAction } from '@/app/actions/auth'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const createSignupSchema = (t: (key: string) => string) =>
	z
		.object({
			name: z.string().min(1, t('nameRequired')),
			username: z.string().min(2, t('usernameMin')).regex(/^[a-zA-Z0-9_-]+$/, t('usernameInvalid')),
			password: z.string().min(8, t('passwordMin')),
			confirmPassword: z.string().min(1, t('confirmPasswordRequired'))
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('passwordMismatch'),
			path: ['confirmPassword']
		})

type SignupFormProps = {
	selectedPlan?: string
}

export function SignupForm({ selectedPlan }: SignupFormProps) {
	const t = useTranslations('Auth.signup')
	const tAuth = useTranslations('Auth')
	const tValidation = useTranslations('Auth.validation')
	const tHeader = useTranslations('Header')
	const router = useRouter()

	const schema = createSignupSchema(tValidation)
	type FormValues = z.infer<typeof schema>

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			username: '',
			password: '',
			confirmPassword: ''
		}
	})

	async function onSubmit(values: FormValues) {
		const result = await signupAction(values.name, values.username, values.password)
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
			<Card className='w-full max-w-lg md:max-w-2xl px-8 md:px-10 py-8'>
				<CardHeader className='space-y-1 px-0'>
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.4 }}
					>
						<CardTitle className='text-2xl'>{t('title')}</CardTitle>
						<CardDescription>
							{selectedPlan ? t('subtitleWithPlan', { brand: tHeader('brand'), plan: selectedPlan }) : t('subtitle')}
						</CardDescription>
					</motion.div>
				</CardHeader>
				<CardContent className='px-0 pt-2'>
					{form.formState.errors.root && (
						<p className='text-destructive mb-4 text-sm'>{form.formState.errors.root.message}</p>
					)}
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
						variants={authFormVariants}
						initial='hidden'
						animate='visible'
					>
						{[
							{
								id: 'signup-name',
								label: t('name'),
								type: 'text' as const,
								autoComplete: 'name' as const,
								field: 'name' as const
							},
							{
								id: 'signup-username',
								label: t('username'),
								type: 'text' as const,
								autoComplete: 'username' as const,
								field: 'username' as const
							},
							{
								id: 'signup-password',
								label: t('password'),
								type: 'password' as const,
								autoComplete: 'new-password' as const,
								field: 'password' as const
							},
							{
								id: 'signup-confirm-password',
								label: t('confirmPassword'),
								type: 'password' as const,
								autoComplete: 'new-password' as const,
								field: 'confirmPassword' as const
							}
						].map(({ id, label, type, autoComplete, field }) => (
							<motion.div
								key={id}
								className='space-y-2'
								variants={authFieldVariants}
							>
								<Label htmlFor={id}>{label}</Label>
								<Input
									id={id}
									type={type}
									placeholder={field === 'username' ? tAuth('placeholder.username') : undefined}
									autoComplete={autoComplete}
									{...form.register(field)}
								/>
								{form.formState.errors[field] && (
									<p className='text-destructive text-sm'>{form.formState.errors[field]?.message}</p>
								)}
							</motion.div>
						))}
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
							{t('hasAccount')}{' '}
							<motion.span
								whileHover={{ y: -1 }}
								className='inline-block'
							>
								<Link
									href='/login'
									className='text-primary font-medium underline underline-offset-4 hover:no-underline'
								>
									{t('logIn')}
								</Link>
							</motion.span>
						</motion.p>
					</motion.form>
				</CardContent>
			</Card>
		</motion.div>
	)
}
