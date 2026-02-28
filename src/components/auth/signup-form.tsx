'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

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

export function SignupForm() {
	const t = useTranslations('Auth.signup')
	const tValidation = useTranslations('Auth.validation')
	const tToast = useTranslations('Auth')

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

	function onSubmit() {
		toast.info(tToast('featureToast'))
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl'>{t('title')}</CardTitle>
				<CardDescription>{t('subtitle')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4'
				>
					<div className='space-y-2'>
						<Label htmlFor='signup-name'>{t('name')}</Label>
						<Input
							id='signup-name'
							type='text'
							autoComplete='name'
							{...form.register('name')}
						/>
						{form.formState.errors.name && (
							<p className='text-destructive text-sm'>{form.formState.errors.name.message}</p>
						)}
					</div>
					<div className='space-y-2'>
						<Label htmlFor='signup-email'>{t('email')}</Label>
						<Input
							id='signup-email'
							type='email'
							placeholder='name@example.com'
							autoComplete='email'
							{...form.register('email')}
						/>
						{form.formState.errors.email && (
							<p className='text-destructive text-sm'>{form.formState.errors.email.message}</p>
						)}
					</div>
					<div className='space-y-2'>
						<Label htmlFor='signup-password'>{t('password')}</Label>
						<Input
							id='signup-password'
							type='password'
							autoComplete='new-password'
							{...form.register('password')}
						/>
						{form.formState.errors.password && (
							<p className='text-destructive text-sm'>{form.formState.errors.password.message}</p>
						)}
					</div>
					<div className='space-y-2'>
						<Label htmlFor='signup-confirm-password'>{t('confirmPassword')}</Label>
						<Input
							id='signup-confirm-password'
							type='password'
							autoComplete='new-password'
							{...form.register('confirmPassword')}
						/>
						{form.formState.errors.confirmPassword && (
							<p className='text-destructive text-sm'>{form.formState.errors.confirmPassword.message}</p>
						)}
					</div>
					<Button
						type='submit'
						className='w-full'
					>
						{t('submit')}
					</Button>
					<p className='text-muted-foreground text-center text-sm'>
						{t('hasAccount')}{' '}
						<Link
							href='/login'
							className='text-primary font-medium underline underline-offset-4 hover:no-underline'
						>
							{t('logIn')}
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	)
}
