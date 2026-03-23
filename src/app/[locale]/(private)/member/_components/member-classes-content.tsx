'use client'

import { CalendarClock, TicketCheck, TicketX } from 'lucide-react'
import { startTransition, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { bookOwnClassAction, cancelOwnClassBookingAction } from '@/app/actions/class-bookings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import type { GymClass } from '@/lib/data'
import { formatDate } from '@/lib/format'

type MemberClass = GymClass & {
	bookingId: string | null
}

type MemberClassesContentProps = {
	classes: MemberClass[]
	hasActiveMembership: boolean
	upcomingBookingCount: number
	maxUpcomingBookings: number
}

function getDisabledReason(
	isBooked: boolean,
	hasActiveMembership: boolean,
	isFull: boolean,
	upcomingBookingCount: number,
	maxUpcomingBookings: number,
	t: ReturnType<typeof useTranslations>
) {
	if (isBooked) {
		return null
	}

	if (!hasActiveMembership) {
		return t('membershipRequired')
	}

	if (isFull) {
		return t('fullHelper')
	}

	if (upcomingBookingCount >= maxUpcomingBookings) {
		return t('bookingLimitReached', { limit: maxUpcomingBookings })
	}

	return null
}

export function MemberClassesContent({
	classes,
	hasActiveMembership,
	upcomingBookingCount,
	maxUpcomingBookings
}: MemberClassesContentProps) {
	const locale = useLocale()
	const t = useTranslations('Member.classes')
	const tWeekdays = useTranslations('Weekdays')
	const router = useRouter()
	const [pendingClassId, setPendingClassId] = useState<string | null>(null)

	function handleBookingAction(gymClass: MemberClass) {
		setPendingClassId(gymClass.id)

		startTransition(async () => {
			const result = gymClass.bookingId
				? await cancelOwnClassBookingAction(gymClass.bookingId)
				: await bookOwnClassAction(gymClass.id)

			setPendingClassId(null)

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success(gymClass.bookingId ? t('cancelSuccess') : t('bookSuccess'))
			router.refresh()
		})
	}

	return (
		<div className='flex flex-col gap-4'>
			<div className='bg-muted/50 rounded-2xl border px-4 py-3'>
				<div className='flex flex-col gap-1'>
					<p className='text-sm font-medium'>{t('upcomingLimit')}</p>
					<p className='text-muted-foreground text-sm'>
						{t('upcomingLimitDescription', { count: upcomingBookingCount, limit: maxUpcomingBookings })}
					</p>
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				{classes.map((gymClass) => {
					const isPending = pendingClassId === gymClass.id
					const isBooked = Boolean(gymClass.bookingId)
					const isFull = gymClass.nextSessionBookings >= gymClass.maxSpots
					const disabledReason = getDisabledReason(
						isBooked,
						hasActiveMembership,
						isFull,
						upcomingBookingCount,
						maxUpcomingBookings,
						t
					)

					return (
						<div
							key={gymClass.id}
							className='from-card via-card to-muted/30 rounded-2xl border bg-gradient-to-br p-4'
						>
							<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
								<div className='flex min-w-0 flex-col gap-2'>
									<div className='flex flex-wrap items-center gap-2'>
										<p className='text-base font-semibold'>{gymClass.name}</p>
										<Badge variant={isBooked ? 'default' : 'outline'}>
											{isBooked ? t('bookedBadge') : t('availableBadge')}
										</Badge>
										{isFull && !isBooked ? <Badge variant='secondary'>{t('fullBadge')}</Badge> : null}
									</div>

									<div className='text-muted-foreground flex flex-wrap items-center gap-3 text-sm'>
										<span>
											{tWeekdays(gymClass.day)} · {gymClass.time}
										</span>
										<span className='inline-flex items-center gap-1'>
											<CalendarClock
												aria-hidden='true'
												className='size-4'
											/>
											{t('nextSessionDate', { date: formatDate(gymClass.nextSessionDate, locale) })}
										</span>
									</div>

									<p className='text-muted-foreground text-sm'>
										{t('capacity', { booked: gymClass.nextSessionBookings, total: gymClass.maxSpots })}
									</p>

									{disabledReason ? <p className='text-muted-foreground text-xs leading-5'>{disabledReason}</p> : null}
								</div>

								<Button
									type='button'
									variant={isBooked ? 'outline' : 'default'}
									onClick={() => handleBookingAction(gymClass)}
									disabled={isPending || Boolean(disabledReason)}
								>
									{isBooked ? <TicketX data-icon='inline-start' /> : <TicketCheck data-icon='inline-start' />}
									{isPending ? t('processing') : isBooked ? t('cancel') : t('book')}
								</Button>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
