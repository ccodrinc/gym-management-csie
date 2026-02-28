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
					</div>
					<div className='space-y-2'>
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
					</div>
					<Button
						type='submit'
						className='w-full'
					>
						{t('submit')}
					</Button>
					<p className='text-muted-foreground text-center text-sm'>
						{t('noAccount')}{' '}
						<Link
							href='/signup'
							className='text-primary font-medium underline underline-offset-4 hover:no-underline'
						>
							{t('signUp')}
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	)
}
