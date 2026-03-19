'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
	createGymClassAction,
	updateGymClassAction
} from '@/app/actions/classes'
import type { GymClass } from '@/lib/data'
import {
	DEFAULT_CLASS_DAY,
	DEFAULT_CLASS_MAX_SPOTS,
	DEFAULT_CLASS_TIME
} from '@/lib/constants'
import { WEEKDAYS } from '@/lib/date'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ClassFormDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode: 'create' | 'edit'
	class?: GymClass | null
	onSuccess?: () => void
}

export function ClassFormDialog({
	open,
	onOpenChange,
	mode,
	class: initialClass,
	onSuccess
}: ClassFormDialogProps) {
	const t = useTranslations('Admin.classes')
	const tWeekdays = useTranslations('Weekdays')
	const [name, setName] = useState('')
	const [day, setDay] = useState(DEFAULT_CLASS_DAY)
	const [time, setTime] = useState(DEFAULT_CLASS_TIME)
	const [maxSpots, setMaxSpots] = useState(DEFAULT_CLASS_MAX_SPOTS)
	const [pending, setPending] = useState(false)

	useEffect(() => {
		if (open) {
			if (mode === 'edit' && initialClass) {
				setName(initialClass.name)
				setDay(initialClass.day)
				setTime(initialClass.time)
				setMaxSpots(initialClass.maxSpots)
			} else {
				setName('')
				setDay(DEFAULT_CLASS_DAY)
				setTime(DEFAULT_CLASS_TIME)
				setMaxSpots(DEFAULT_CLASS_MAX_SPOTS)
			}
		}
	}, [open, mode, initialClass])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setPending(true)
		try {
			if (mode === 'create') {
				const result = await createGymClassAction(name, day, time, maxSpots)
				if (result.ok) {
					toast.success(t('classCreated'))
					onOpenChange(false)
					onSuccess?.()
				} else {
					toast.error(result.error)
				}
			} else if (initialClass) {
				const result = await updateGymClassAction(
					initialClass.id,
					name,
					day,
					time,
					maxSpots
				)
				if (result.ok) {
					toast.success(t('classUpdated'))
					onOpenChange(false)
					onSuccess?.()
				} else {
					toast.error(result.error)
				}
			}
		} finally {
			setPending(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>{mode === 'create' ? t('addClass') : t('editClass')}</DialogTitle>
					<DialogDescription>
						{mode === 'create' ? t('addClassDescription') : t('editClassDescription')}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='class-name'>{t('className')}</Label>
						<Input
							id='class-name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={t('classNamePlaceholder')}
							required
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='class-day'>{t('day')}</Label>
						<select
							id='class-day'
							className='border-input bg-background w-full rounded-md border px-3 py-2 text-sm'
							value={day}
							onChange={(e) => setDay(e.target.value)}
						>
							{WEEKDAYS.map((d) => (
								<option key={d} value={d}>
									{tWeekdays(d)}
								</option>
							))}
						</select>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='class-time'>{t('time')}</Label>
						<Input
							id='class-time'
							type='time'
							value={time}
							onChange={(e) => setTime(e.target.value)}
							required
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='class-maxSpots'>{t('maxSpots')}</Label>
						<Input
							id='class-maxSpots'
							type='number'
							min={1}
							max={999}
							value={maxSpots}
							onChange={(e) => setMaxSpots(Number(e.target.value) || 1)}
							required
						/>
						{mode === 'edit' && initialClass && (
							<p className='text-muted-foreground text-xs'>
								{t('currentEnrolled')}: {initialClass.totalUpcomingBookings}
							</p>
						)}
					</div>
					<div className='flex justify-end gap-2 pt-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							{t('cancel')}
						</Button>
						<Button type='submit' disabled={pending}>
							{pending ? t('saving') : mode === 'create' ? t('create') : t('save')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
