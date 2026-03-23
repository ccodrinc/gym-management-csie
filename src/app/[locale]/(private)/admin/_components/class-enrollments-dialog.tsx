'use client'

import { Trash2, UserPlus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { addClassBookingAction, getClassBookingsAction, removeClassBookingAction } from '@/app/actions/class-bookings'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ClassWithBookings, Member } from '@/lib/data'
import { getNextOccurrenceString, WEEKDAYS } from '@/lib/date'
import { formatDate } from '@/lib/format'

type ClassEnrollmentsDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	gymClassId: string | null
	className: string
	classDay: string
	classTime: string
	members: Member[]
}

const selectClassName =
	'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 block h-9 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow]'

function getNextClassDate(day: string) {
	return WEEKDAYS.includes(day as (typeof WEEKDAYS)[number])
		? getNextOccurrenceString(day as (typeof WEEKDAYS)[number])
		: getNextOccurrenceString('Mon')
}

export function ClassEnrollmentsDialog({
	open,
	onOpenChange,
	gymClassId,
	className,
	classDay,
	classTime,
	members
}: ClassEnrollmentsDialogProps) {
	const locale = useLocale()
	const t = useTranslations('Admin.classes')
	const tWeekdays = useTranslations('Weekdays')
	const [data, setData] = useState<ClassWithBookings | null>(null)
	const [loading, setLoading] = useState(true)
	const [addUserId, setAddUserId] = useState('')
	const [addDate, setAddDate] = useState(() => getNextClassDate(classDay))
	const [addPending, setAddPending] = useState(false)
	const [removePendingId, setRemovePendingId] = useState<string | null>(null)

	const fetchBookings = useCallback(async () => {
		if (!gymClassId) {
			return
		}

		setLoading(true)
		const result = await getClassBookingsAction(gymClassId)
		setLoading(false)

		if (result.ok && result.data) {
			setData(result.data)
			return
		}

		if (!result.ok) {
			toast.error(result.error)
		}
	}, [gymClassId])

	useEffect(() => {
		setAddDate(getNextClassDate(classDay))
	}, [classDay])

	useEffect(() => {
		if (!open || !gymClassId) {
			return
		}

		let cancelled = false
		const classId = gymClassId

		async function loadBookings() {
			setLoading(true)
			const result = await getClassBookingsAction(classId)

			if (cancelled) {
				return
			}

			setLoading(false)

			if (result.ok && result.data) {
				setData(result.data)
				return
			}

			if (!result.ok) {
				toast.error(result.error)
			}
		}

		void loadBookings()

		return () => {
			cancelled = true
		}
	}, [gymClassId, open])

	async function handleRemove(bookingId: string) {
		setRemovePendingId(bookingId)
		const result = await removeClassBookingAction(bookingId)
		setRemovePendingId(null)

		if (!result.ok) {
			toast.error(result.error)
			return
		}

		toast.success(t('bookingRemoved'))
		void fetchBookings()
	}

	async function handleAdd() {
		if (!gymClassId || !addUserId || !addDate) {
			toast.error(t('fillMemberAndDate'))
			return
		}

		setAddPending(true)
		const result = await addClassBookingAction(addUserId, gymClassId, addDate)
		setAddPending(false)

		if (!result.ok) {
			toast.error(result.error)
			return
		}

		toast.success(t('bookingAdded'))
		setAddUserId('')
		void fetchBookings()
	}

	const sessionBookings = (data?.bookings ?? []).filter((booking) => booking.date === addDate)
	const enrolledIdsForSelectedDate = new Set(sessionBookings.map((booking) => booking.userId))
	const availableMembers = members.filter((member) => member.isActive && !enrolledIdsForSelectedDate.has(member.id))
	const selectedDateBookings = sessionBookings.length
	const selectedDateIsFull = selectedDateBookings >= (data?.maxSpots ?? 0)

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='max-h-[85vh] max-w-3xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{t('enrollments')} · {className}
					</DialogTitle>
					<DialogDescription>
						{tWeekdays(classDay)} · {classTime}. {t('enrollmentsDescription')}
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col gap-5'>
					<section className='flex flex-col gap-2'>
						<h3 className='text-sm font-medium'>{t('enrolledMembers')}</h3>

						{loading ? (
							<p className='text-muted-foreground text-sm'>{t('loading')}</p>
						) : data?.bookings.length ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t('member')}</TableHead>
										<TableHead>{t('date')}</TableHead>
										<TableHead>{t('time')}</TableHead>
										<TableHead className='w-[88px] text-right'>{t('remove')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.bookings.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell>
												<div className='flex min-w-0 flex-col gap-1'>
													<span className='font-medium'>{booking.userName ?? booking.username}</span>
													<span className='text-muted-foreground text-xs'>@{booking.username}</span>
												</div>
											</TableCell>
											<TableCell>{formatDate(booking.date, locale)}</TableCell>
											<TableCell>{booking.time}</TableCell>
											<TableCell className='text-right'>
												<Button
													type='button'
													variant='ghost'
													size='icon-sm'
													className='text-destructive hover:text-destructive'
													onClick={() => handleRemove(booking.id)}
													disabled={removePendingId === booking.id}
													aria-label={`${t('remove')} ${booking.userName ?? booking.username}`}
												>
													<Trash2
														aria-hidden='true'
														className='size-4'
													/>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<p className='text-muted-foreground text-sm'>{t('noEnrollments')}</p>
						)}
					</section>

					{data ? (
						<section className='flex flex-col gap-4 rounded-xl border p-4'>
							<div className='flex items-center gap-2 text-sm font-medium'>
								<UserPlus
									aria-hidden='true'
									className='text-primary size-4'
								/>
								{t('addMember')}
							</div>
							<p className='text-muted-foreground text-xs leading-5'>
								{t('capacityForDate', { booked: selectedDateBookings, total: data.maxSpots })}
							</p>

							<div className='grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem_auto] md:items-end'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='booking-member'>{t('member')}</Label>
									<select
										id='booking-member'
										name='bookingMember'
										className={selectClassName}
										value={addUserId}
										onChange={(event) => setAddUserId(event.target.value)}
										autoComplete='off'
									>
										<option value=''>{t('selectMember')}</option>
										{availableMembers.map((member) => (
											<option
												key={member.id}
												value={member.id}
											>
												{member.name ?? member.username}
											</option>
										))}
									</select>
								</div>

								<div className='flex flex-col gap-2'>
									<Label htmlFor='booking-date'>{t('date')}</Label>
									<Input
										id='booking-date'
										name='bookingDate'
										type='date'
										value={addDate}
										onChange={(event) => setAddDate(event.target.value)}
										autoComplete='off'
									/>
								</div>

								<Button
									type='button'
									size='sm'
									onClick={handleAdd}
									disabled={addPending || !addUserId || !addDate || selectedDateIsFull}
								>
									{addPending ? t('adding') : t('add')}
								</Button>
							</div>
						</section>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	)
}
