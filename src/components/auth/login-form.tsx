'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Pressable } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const formVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.1 }
	}
}

const fieldVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0 }
}

const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
		password: z.string().min(1, t('passwordRequired'))
	})

export function LoginForm() {
	const t = useTranslations('Auth.login')
	const tValidation = useTranslations('Auth.validation')
	const tToast = useTranslations('Auth')

	const schema = createLoginSchema(tValidation)
	type FormValues = z.infer<typeof schema>

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	function onSubmit() {
		toast.info(tToast('featureToast'))
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
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
						variants={formVariants}
						initial='hidden'
						animate='visible'
					>
						<motion.div
							className='space-y-2'
							variants={fieldVariants}
						>
							<Label htmlFor='login-email'>{t('email')}</Label>
							<Input
								id='login-email'
								type='email'
								placeholder='name@example.com'
								autoComplete='email'
								{...form.register('email')}
							/>
							{form.formState.errors.email && (
								<p className='text-destructive text-sm'>{form.formState.errors.email.message}</p>
							)}
						</motion.div>
						<motion.div
							className='space-y-2'
							variants={fieldVariants}
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
