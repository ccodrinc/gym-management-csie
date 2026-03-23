'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, ShieldCheck, Sparkles } from 'lucide-react'
import { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { z } from 'zod'

import { purchaseMembershipAction } from '@/app/actions/membership'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { MembershipStatus, MembershipType } from '@/generated/prisma/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from '@/i18n/navigation'
import { formatCurrency, formatNumber } from '@/lib/format'
import { MEMBERSHIP_PLANS, MEMBERSHIP_STATUS, MEMBERSHIP_TYPE } from '@/lib/membership'

type MembershipManagerProps = {
	member: {
		membershipType: string
		membershipTypeKey: MembershipType | null
		membershipStatus: string
		membershipStatusKey: MembershipStatus
		startDate: string | null
		expiryDate: string | null
		gymVisits: number
		isActive: boolean
	}
	preferredPlan: MembershipType | null
}

type DialogStep = 'plan' | 'payment'

function getStatusVariant(status: MembershipStatus): 'default' | 'secondary' | 'outline' {
	switch (status) {
		case MEMBERSHIP_STATUS.ACTIVE:
			return 'default'
		case MEMBERSHIP_STATUS.EXPIRED:
			return 'outline'
		default:
			return 'secondary'
	}
}

export function MembershipManager({ member, preferredPlan }: MembershipManagerProps) {
	const locale = useLocale()
	const t = useTranslations('Member.membership')
	const router = useRouter()
	const paymentSchema = z.object({
		cardholder: z.string().trim().min(3, t('validation.cardholder')),
		cardNumber: z
			.string()
			.trim()
			.regex(/^\d{16}$/, t('validation.cardNumber')),
		expiry: z
			.string()
			.trim()
			.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t('validation.expiry')),
		cvc: z
			.string()
			.trim()
			.regex(/^\d{3,4}$/, t('validation.cvc')),
		zipCode: z
			.string()
			.trim()
			.regex(/^\d{5}$/, t('validation.zipCode'))
	})
	type PaymentValues = z.infer<typeof paymentSchema>

	const demoPaymentValues = {
		cardholder: 'Jordan Lee',
		cardNumber: '4242424242424242',
		expiry: '09/28',
		cvc: '123',
		zipCode: '90210'
	} satisfies PaymentValues

	const [selectedPlan, setSelectedPlan] = useState<MembershipType>(
		preferredPlan ?? member.membershipTypeKey ?? MEMBERSHIP_TYPE.Monthly
	)
	const [dialogOpen, setDialogOpen] = useState(Boolean(preferredPlan))
	const [step, setStep] = useState<DialogStep>('plan')
	const [pending, setPending] = useState(false)

	const form = useForm<PaymentValues>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			cardholder: '',
			cardNumber: '',
			expiry: '',
			cvc: '',
			zipCode: ''
		}
	})

	function openDialog() {
		setStep('plan')
		setDialogOpen(true)
	}

	function closeDialog() {
		setDialogOpen(false)
		setStep('plan')
		form.reset()
	}

	function handleDialogOpenChange(open: boolean) {
		if (open) {
			openDialog()
			return
		}

		closeDialog()
	}

	function getPlanCopy(type: MembershipType) {
		return {
			title: t(`plans.${type}.title`),
			description: t(`plans.${type}.description`),
			period: t(`plans.${type}.period`),
			features: t.raw(`plans.${type}.features`) as string[]
		}
	}

	function autofillDemoPayment() {
		form.reset(demoPaymentValues)
	}

	function onSubmit() {
		setPending(true)

		startTransition(async () => {
			try {
				const result = await purchaseMembershipAction(selectedPlan)
				if (!result.ok) {
					toast.error(result.error)
					return
				}

				toast.success(t('purchaseSuccess'))
				closeDialog()
				router.replace('/member/membership')
				router.refresh()
			} finally {
				setPending(false)
			}
		})
	}

	return (
		<div className='flex flex-col gap-6'>
			<Card className='border-primary/20 from-card via-card to-primary/5 overflow-hidden bg-gradient-to-br'>
				<CardHeader className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
					<div className='flex flex-col gap-2'>
						<CardTitle>{t('summaryTitle')}</CardTitle>
						<CardDescription>{t('summaryDescription')}</CardDescription>
					</div>
					<div className='flex flex-wrap items-center gap-3'>
						<Badge variant={getStatusVariant(member.membershipStatusKey)}>{member.membershipStatus}</Badge>
						<Button
							type='button'
							onClick={openDialog}
						>
							{member.isActive ? t('changeMembership') : t('activateMembership')}
						</Button>
					</div>
				</CardHeader>
				<CardContent className='grid gap-4 sm:grid-cols-3'>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground text-sm'>{t('currentPlan')}</p>
						<p className='text-lg font-semibold'>{member.membershipType}</p>
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground text-sm'>{t('startDate')}</p>
						<p className='text-lg font-semibold'>{member.startDate ?? '—'}</p>
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground text-sm'>{t('expiryDate')}</p>
						<p className='text-lg font-semibold'>{member.expiryDate ?? '—'}</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>{t('detailsTitle')}</CardTitle>
					<CardDescription>{t('detailsDescription')}</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4 sm:grid-cols-3'>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground text-sm'>{t('currentStatus')}</p>
						<p className='font-medium'>{member.membershipStatus}</p>
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground text-sm'>{t('totalGymVisits')}</p>
						<p className='font-medium'>{formatNumber(member.gymVisits, locale)}</p>
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground text-sm'>{t('classLimit')}</p>
						<p className='font-medium'>{t('classLimitValue')}</p>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={dialogOpen}
				onOpenChange={handleDialogOpenChange}
			>
				<DialogContent className='max-h-[85vh] max-w-5xl overflow-y-auto p-0'>
					<div className='flex flex-col gap-6 p-6'>
						<DialogHeader className='flex flex-col gap-2'>
							<DialogTitle>{step === 'plan' ? t('choosePlanTitle') : t('paymentTitle')}</DialogTitle>
							<DialogDescription>
								{step === 'plan' ? t('choosePlanDescription') : t('paymentDescription')}
							</DialogDescription>
						</DialogHeader>

						<div className='flex items-center gap-2 text-sm'>
							<Badge variant={step === 'plan' ? 'default' : 'outline'}>{t('stepChoosePlan')}</Badge>
							<Badge variant={step === 'payment' ? 'default' : 'outline'}>{t('stepPayment')}</Badge>
						</div>

						{step === 'plan' ? (
							<>
								<div className='grid gap-4 md:grid-cols-3'>
									{MEMBERSHIP_PLANS.map((plan) => {
										const isSelected = selectedPlan === plan.type
										const planCopy = getPlanCopy(plan.type)

										return (
											<button
												key={plan.type}
												type='button'
												onClick={() => setSelectedPlan(plan.type)}
												aria-pressed={isSelected}
												className={
													isSelected
														? 'border-primary bg-primary/8 rounded-2xl border p-4 text-left shadow-sm transition-[background-color,border-color,box-shadow]'
														: 'border-border hover:border-primary/40 hover:bg-muted/40 rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow]'
												}
											>
												<div className='mb-3 flex items-center justify-between gap-2'>
													<div className='flex min-w-0 flex-col gap-1'>
														<p className='text-base font-semibold'>{planCopy.title}</p>
														<p className='text-muted-foreground text-sm'>{planCopy.description}</p>
													</div>
													{isSelected ? <Badge>{t('selected')}</Badge> : null}
												</div>
												<p className='text-2xl font-semibold'>
													{formatCurrency(plan.price, locale)}
													<span className='text-muted-foreground ml-1 text-sm font-normal'>{planCopy.period}</span>
												</p>
												<ul className='text-muted-foreground mt-4 flex flex-col gap-2 text-sm'>
													{planCopy.features.map((feature) => (
														<li
															key={feature}
															className='flex items-center gap-2'
														>
															<Sparkles
																aria-hidden='true'
																className='text-primary size-4'
															/>
															{feature}
														</li>
													))}
												</ul>
											</button>
										)
									})}
								</div>

								<div className='flex justify-end'>
									<Button
										type='button'
										onClick={() => setStep('payment')}
									>
										{t('continueToPayment')}
									</Button>
								</div>
							</>
						) : (
							<Card className='border-primary/20 from-card to-muted/40 bg-gradient-to-b'>
								<CardHeader>
									<div className='flex items-center gap-2'>
										<CreditCard
											aria-hidden='true'
											className='text-primary size-5'
										/>
										<CardTitle>{t('paymentTitle')}</CardTitle>
									</div>
									<CardDescription>{t('paymentDescription')}</CardDescription>
								</CardHeader>
								<CardContent className='flex flex-col gap-4'>
									<div className='bg-background/80 rounded-2xl border p-4'>
										<p className='text-muted-foreground text-sm'>{t('selectedPlan')}</p>
										<p className='mt-1 text-lg font-semibold'>{getPlanCopy(selectedPlan).title}</p>
									</div>

									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className='flex flex-col gap-4'
									>
										<div className='flex justify-end'>
											<Button
												type='button'
												variant='outline'
												onClick={autofillDemoPayment}
											>
												{t('autofillDemoPayment')}
											</Button>
										</div>

										<div className='flex flex-col gap-2'>
											<Label htmlFor='cardholder'>{t('cardholder')}</Label>
											<Input
												id='cardholder'
												placeholder={t('cardholderPlaceholder')}
												autoComplete='cc-name'
												{...form.register('cardholder')}
											/>
											{form.formState.errors.cardholder ? (
												<p className='text-destructive text-sm'>{form.formState.errors.cardholder.message}</p>
											) : null}
										</div>

										<div className='flex flex-col gap-2'>
											<Label htmlFor='card-number'>{t('cardNumber')}</Label>
											<Input
												id='card-number'
												inputMode='numeric'
												maxLength={16}
												placeholder={t('cardNumberPlaceholder')}
												autoComplete='cc-number'
												spellCheck={false}
												{...form.register('cardNumber')}
											/>
											{form.formState.errors.cardNumber ? (
												<p className='text-destructive text-sm'>{form.formState.errors.cardNumber.message}</p>
											) : null}
										</div>

										<div className='grid gap-4 sm:grid-cols-3'>
											<div className='flex flex-col gap-2'>
												<Label htmlFor='card-expiry'>{t('expiry')}</Label>
												<Input
													id='card-expiry'
													maxLength={5}
													placeholder={t('expiryPlaceholder')}
													autoComplete='cc-exp'
													inputMode='numeric'
													spellCheck={false}
													{...form.register('expiry')}
												/>
												{form.formState.errors.expiry ? (
													<p className='text-destructive text-sm'>{form.formState.errors.expiry.message}</p>
												) : null}
											</div>

											<div className='flex flex-col gap-2'>
												<Label htmlFor='card-cvc'>{t('cvc')}</Label>
												<Input
													id='card-cvc'
													inputMode='numeric'
													maxLength={4}
													placeholder={t('cvcPlaceholder')}
													autoComplete='cc-csc'
													spellCheck={false}
													{...form.register('cvc')}
												/>
												{form.formState.errors.cvc ? (
													<p className='text-destructive text-sm'>{form.formState.errors.cvc.message}</p>
												) : null}
											</div>

											<div className='flex flex-col gap-2'>
												<Label htmlFor='card-zip'>{t('zipCode')}</Label>
												<Input
													id='card-zip'
													inputMode='numeric'
													maxLength={5}
													placeholder={t('zipCodePlaceholder')}
													autoComplete='postal-code'
													spellCheck={false}
													{...form.register('zipCode')}
												/>
												{form.formState.errors.zipCode ? (
													<p className='text-destructive text-sm'>{form.formState.errors.zipCode.message}</p>
												) : null}
											</div>
										</div>

										<div className='bg-muted/60 flex items-start gap-3 rounded-2xl border p-3 text-sm'>
											<ShieldCheck
												aria-hidden='true'
												className='text-primary mt-0.5 size-4'
											/>
											<p className='text-muted-foreground'>{t('paymentNote')}</p>
										</div>

										<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-between'>
											<Button
												type='button'
												variant='outline'
												onClick={() => setStep('plan')}
											>
												{t('backToPlans')}
											</Button>
											<Button
												type='submit'
												className='sm:min-w-44'
												disabled={pending}
											>
												{pending ? t('processing') : member.isActive ? t('changeMembership') : t('activateMembership')}
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
