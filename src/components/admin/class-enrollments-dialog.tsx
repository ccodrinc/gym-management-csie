'use client'

import { Trash2, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
	addClassBookingAction,
	getClassBookingsAction,
	removeClassBookingAction
} from '@/app/actions/class-bookings'
import type { ClassWithBookings } from '@/lib/data'
import type { Member } from '@/lib/data'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { getTodayString, toDateString, WEEKDAYS } from '@/lib/date'

type ClassEnrollmentsDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	gymClassId: string | null
	className: string
	classDay: string
	classTime: string
	members: Member[]
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
	const t = useTranslations('Admin.classes')
	const [data, setData] = useState<ClassWithBookings | null>(null)
	const [loading, setLoading] = useState(false)
	const [addUserId, setAddUserId] = useState('')
	const [addDate, setAddDate] = useState('')
	const [addPending, setAddPending] = useState(false)
	const [removePendingId, setRemovePendingId] = useState<string | null>(null)

	const fetchBookings = useCallback(async () => {
		if (!gymClassId) return
		const result = await getClassBookingsAction(gymClassId)
		if (result.ok && result.data) setData(result.data)
		else if (!result.ok) toast.error(result.error)
	}, [gymClassId])

	useEffect(() => {
		if (!open || !gymClassId) return
		let cancelled = false
		queueMicrotask(() => {
			if (!cancelled) setLoading(true)
		})
		void getClassBookingsAction(gymClassId).then((result) => {
			if (cancelled) return
			setLoading(false)
			if (result.ok && result.data) setData(result.data)
			else if (!result.ok) toast.error(result.error)
		})
		queueMicrotask(() => {
			if (cancelled) return
			const today = new Date()
			const dayIndex = WEEKDAYS.indexOf(classDay as (typeof WEEKDAYS)[number])
			const nextDateStr =
				dayIndex >= 0
					? (() => {
							const currentDay = today.getDay()
							const targetDay = dayIndex === 6 ? 0 : dayIndex + 1
							const daysUntil = (targetDay - currentDay + 7) % 7 || 7
							const nextDate = new Date(today)
							nextDate.setDate(today.getDate() + daysUntil)
							return toDateString(nextDate)
						})()
					: getTodayString()
			setAddDate(nextDateStr)
			setAddUserId('')
		})
		return () => {
			cancelled = true
		}
	}, [open, gymClassId, classDay])

	async function handleRemove(bookingId: string) {
		setRemovePendingId(bookingId)
		const result = await removeClassBookingAction(bookingId)
		setRemovePendingId(null)
		if (result.ok) {
			toast.success(t('bookingRemoved'))
			fetchBookings()
		} else {
			toast.error(result.error)
		}
	}

	async function handleAdd() {
		if (!gymClassId || !addUserId || !addDate) {
			toast.error(t('fillMemberAndDate'))
			return
		}
		setAddPending(true)
		const result = await addClassBookingAction(addUserId, gymClassId, addDate, classTime)
		setAddPending(false)
		if (result.ok) {
			toast.success(t('bookingAdded'))
			setAddUserId('')
			fetchBookings()
		} else {
			toast.error(result.error)
		}
	}

	const enrolledIds = new Set((data?.bookings ?? []).map((b) => b.userId))
	const availableMembers = members.filter((m) => !enrolledIds.has(m.id))

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[85vh] max-w-2xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{t('enrollments')} – {className}
					</DialogTitle>
					<DialogDescription>
						{classDay} · {classTime}. {t('enrollmentsDescription')}
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4'>
					<div>
						<h4 className='text-foreground mb-2 text-sm font-medium'>{t('enrolledMembers')}</h4>
						{loading ? (
							<p className='text-muted-foreground text-sm'>{t('loading')}</p>
						) : data && data.bookings.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t('member')}</TableHead>
										<TableHead>{t('date')}</TableHead>
										<TableHead>{t('time')}</TableHead>
										<TableHead className='w-[80px]' />
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.bookings.map((b) => (
										<TableRow key={b.id}>
											<TableCell>
												<span className='font-medium'>
													{b.userName ?? b.username}
												</span>
												<span className='text-muted-foreground ml-1 text-xs'>
													@{b.username}
												</span>
											</TableCell>
											<TableCell>{b.date}</TableCell>
											<TableCell>{b.time}</TableCell>
											<TableCell>
												<Button
													variant='ghost'
													size='icon-sm'
													className='text-destructive hover:text-destructive'
													onClick={() => handleRemove(b.id)}
													disabled={removePendingId === b.id}
													aria-label={t('remove')}
												>
													<Trash2 className='size-4' />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<p className='text-muted-foreground text-sm'>{t('noEnrollments')}</p>
						)}
					</div>

					{data && data.spots < data.maxSpots && (
						<div className='border-border rounded-md border p-3'>
							<h4 className='text-foreground mb-2 flex items-center gap-2 text-sm font-medium'>
								<UserPlus className='size-4' />
								{t('addMember')}
							</h4>
							<div className='flex flex-wrap items-end gap-2'>
								<div className='min-w-[180px]'>
									<label className='text-muted-foreground mb-1 block text-xs'>
										{t('member')}
									</label>
									<select
										className='border-input bg-background w-full rounded-md border px-3 py-2 text-sm'
										value={addUserId}
										onChange={(e) => setAddUserId(e.target.value)}
									>
										<option value=''>{t('selectMember')}</option>
										{availableMembers.map((m) => (
											<option key={m.id} value={m.id}>
												{m.name ?? m.username}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className='text-muted-foreground mb-1 block text-xs'>
										{t('date')}
									</label>
									<input
										type='date'
										className='border-input bg-background w-full rounded-md border px-3 py-2 text-sm'
										value={addDate}
										onChange={(e) => setAddDate(e.target.value)}
									/>
								</div>
								<Button
									size='sm'
									onClick={handleAdd}
									disabled={addPending || !addUserId || !addDate}
								>
									{addPending ? t('adding') : t('add')}
								</Button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
