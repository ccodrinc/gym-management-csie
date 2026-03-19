'use client'

import { startTransition, useState } from 'react'
import { CalendarClock, TicketCheck, TicketX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import {
	bookOwnClassAction,
	cancelOwnClassBookingAction
} from '@/app/actions/class-bookings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { GymClass } from '@/lib/data'
import { useRouter } from '@/i18n/navigation'

type MemberClass = GymClass & {
	bookingId: string | null
}

type MemberClassesContentProps = {
	classes: MemberClass[]
	hasActiveMembership: boolean
	upcomingBookingCount: number
	maxUpcomingBookings: number
}

export function MemberClassesContent({
	classes,
	hasActiveMembership,
	upcomingBookingCount,
	maxUpcomingBookings
}: MemberClassesContentProps) {
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
		<div className='space-y-4'>
			<div className='bg-muted/50 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3'>
				<div>
					<p className='text-sm font-medium'>{t('upcomingLimit')}</p>
					<p className='text-muted-foreground text-sm'>
						{t('upcomingLimitDescription', {
							count: upcomingBookingCount,
							limit: maxUpcomingBookings
						})}
					</p>
				</div>
				<Badge variant={hasActiveMembership ? 'default' : 'secondary'}>
					{hasActiveMembership ? t('membershipActive') : t('membershipInactive')}
				</Badge>
			</div>

			<div className='space-y-3'>
				{classes.map((gymClass) => {
					const isPending = pendingClassId === gymClass.id
					const isBooked = Boolean(gymClass.bookingId)
					const isFull = gymClass.nextSessionBookings >= gymClass.maxSpots
					const isDisabled =
						!isBooked &&
						(!hasActiveMembership ||
							isFull ||
							upcomingBookingCount >= maxUpcomingBookings)

					return (
						<div
							key={gymClass.id}
							className='rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-4'
						>
							<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
								<div className='space-y-2'>
									<div className='flex flex-wrap items-center gap-2'>
										<p className='text-base font-semibold'>{gymClass.name}</p>
										<Badge variant={isBooked ? 'default' : 'outline'}>
											{isBooked ? t('bookedBadge') : t('availableBadge')}
										</Badge>
										{isFull && !isBooked && (
											<Badge variant='secondary'>{t('fullBadge')}</Badge>
										)}
									</div>
									<div className='text-muted-foreground flex flex-wrap items-center gap-3 text-sm'>
										<span>
											{tWeekdays(gymClass.day)} · {gymClass.time}
										</span>
										<span className='inline-flex items-center gap-1'>
											<CalendarClock className='size-4' />
											{t('nextSessionDate', { date: gymClass.nextSessionDate })}
										</span>
									</div>
									<p className='text-muted-foreground text-sm'>
										{t('capacity', {
											booked: gymClass.nextSessionBookings,
											total: gymClass.maxSpots
										})}
									</p>
								</div>

								<Button
									variant={isBooked ? 'outline' : 'default'}
									onClick={() => handleBookingAction(gymClass)}
									disabled={isPending || isDisabled}
								>
									{isBooked ? <TicketX className='size-4' /> : <TicketCheck className='size-4' />}
									{isPending
										? t('processing')
										: isBooked
											? t('cancel')
											: t('book')}
								</Button>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
