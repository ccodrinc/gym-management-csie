'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { EASE } from '@/lib/motion'
import { Pressable } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { demoLogin } from '@/app/actions/auth'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const formVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.07, delayChildren: 0.1 }
	}
}

const fieldVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0 }
}

const createSignupSchema = (t: (key: string) => string) =>
	z
		.object({
			name: z.string().min(1, t('nameRequired')),
			email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
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

	const schema = createSignupSchema(tValidation)
	type FormValues = z.infer<typeof schema>

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	})

	async function onSubmit() {
		// Demo: set auth cookie and redirect. Replace with real auth.
		await demoLogin('/member')
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
						<CardDescription>
							{selectedPlan ? t('subtitleWithPlan', { brand: tHeader('brand'), plan: selectedPlan }) : t('subtitle')}
						</CardDescription>
					</motion.div>
				</CardHeader>
				<CardContent>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
						variants={formVariants}
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
								id: 'signup-email',
								label: t('email'),
								type: 'email' as const,
								autoComplete: 'email' as const,
								field: 'email' as const
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
								variants={fieldVariants}
							>
								<Label htmlFor={id}>{label}</Label>
								<Input
									id={id}
									type={type}
									placeholder={type === 'email' ? tAuth('placeholder.email') : undefined}
									autoComplete={autoComplete}
									{...form.register(field)}
								/>
								{form.formState.errors[field] && (
									<p className='text-destructive text-sm'>{form.formState.errors[field]?.message}</p>
								)}
							</motion.div>
						))}
						<motion.div variants={fieldVariants}>
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
							variants={fieldVariants}
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
