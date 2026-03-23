'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import { signupAction } from '@/app/actions/auth'
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

const createSignupSchema = (t: (key: string) => string) =>
	z
		.object({
			name: z.string().min(1, t('nameRequired')),
			username: z
				.string()
				.min(2, t('usernameMin'))
				.regex(/^[a-zA-Z0-9_-]+$/, t('usernameInvalid')),
			password: z.string().min(8, t('passwordMin')),
			confirmPassword: z.string().min(1, t('confirmPasswordRequired'))
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('passwordMismatch'),
			path: ['confirmPassword']
		})

type SignupFormProps = {
	selectedPlanLabel?: string
	selectedPlanValue?: string
}

export function SignupForm({ selectedPlanLabel, selectedPlanValue }: SignupFormProps) {
	const shouldReduceMotion = useReducedMotion()
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
		const result = await signupAction(values.name, values.username, values.password, selectedPlanValue)
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
					<CardDescription>
						{selectedPlanLabel
							? t('subtitleWithPlan', { brand: tHeader('brand'), plan: selectedPlanLabel })
							: t('subtitle')}
					</CardDescription>
				</CardHeader>

				<CardContent className='px-0 pt-2'>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col gap-5'
						variants={shouldReduceMotion ? undefined : formVariants}
						initial={shouldReduceMotion ? undefined : 'hidden'}
						animate={shouldReduceMotion ? undefined : 'visible'}
					>
						{[
							{
								id: 'signup-name',
								label: t('name'),
								type: 'text' as const,
								autoComplete: 'name' as const,
								field: 'name' as const,
								spellCheck: false
							},
							{
								id: 'signup-username',
								label: t('username'),
								type: 'text' as const,
								autoComplete: 'username' as const,
								field: 'username' as const,
								spellCheck: false
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
						].map(({ id, label, type, autoComplete, field, spellCheck }) => (
							<motion.div
								key={id}
								className='flex flex-col gap-2'
								variants={shouldReduceMotion ? undefined : fieldVariants}
							>
								<Label htmlFor={id}>{label}</Label>
								<Input
									id={id}
									type={type}
									placeholder={field === 'username' ? tAuth('placeholder.username') : undefined}
									autoComplete={autoComplete}
									autoCapitalize={field === 'username' ? 'none' : undefined}
									spellCheck={spellCheck}
									aria-invalid={Boolean(form.formState.errors[field])}
									aria-describedby={form.formState.errors[field] ? `${id}-error` : undefined}
									{...form.register(field)}
								/>
								{form.formState.errors[field] ? (
									<p
										id={`${id}-error`}
										className='text-destructive text-sm'
									>
										{form.formState.errors[field]?.message}
									</p>
								) : null}
							</motion.div>
						))}

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
							{t('hasAccount')}{' '}
							<Link
								href='/login'
								className='text-primary font-medium underline underline-offset-4 transition-colors hover:opacity-90'
							>
								{t('logIn')}
							</Link>
						</motion.p>
					</motion.form>
				</CardContent>
			</Card>
		</motion.div>
	)
}
