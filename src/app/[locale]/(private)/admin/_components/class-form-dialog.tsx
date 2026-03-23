'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { createGymClassAction, updateGymClassAction } from '@/app/actions/classes'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_CLASS_DAY, DEFAULT_CLASS_MAX_SPOTS, DEFAULT_CLASS_TIME } from '@/lib/constants'
import type { GymClass } from '@/lib/data'
import { WEEKDAYS } from '@/lib/date'

type ClassFormDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode: 'create' | 'edit'
	class?: GymClass | null
	onSuccess?: () => void
}

const selectClassName =
	'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 block h-9 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow]'

export function ClassFormDialog({ open, onOpenChange, mode, class: initialClass, onSuccess }: ClassFormDialogProps) {
	const t = useTranslations('Admin.classes')
	const tWeekdays = useTranslations('Weekdays')
	const [name, setName] = useState('')
	const [day, setDay] = useState(DEFAULT_CLASS_DAY)
	const [time, setTime] = useState(DEFAULT_CLASS_TIME)
	const [maxSpots, setMaxSpots] = useState(DEFAULT_CLASS_MAX_SPOTS)
	const [pending, setPending] = useState(false)

	useEffect(() => {
		if (!open) {
			return
		}

		if (mode === 'edit' && initialClass) {
			setName(initialClass.name)
			setDay(initialClass.day)
			setTime(initialClass.time)
			setMaxSpots(initialClass.maxSpots)
			return
		}

		setName('')
		setDay(DEFAULT_CLASS_DAY)
		setTime(DEFAULT_CLASS_TIME)
		setMaxSpots(DEFAULT_CLASS_MAX_SPOTS)
	}, [initialClass, mode, open])

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setPending(true)

		try {
			if (mode === 'create') {
				const result = await createGymClassAction(name, day, time, maxSpots)
				if (!result.ok) {
					toast.error(result.error)
					return
				}

				toast.success(t('classCreated'))
			} else if (initialClass) {
				const result = await updateGymClassAction(initialClass.id, name, day, time, maxSpots)
				if (!result.ok) {
					toast.error(result.error)
					return
				}

				toast.success(t('classUpdated'))
			}

			onOpenChange(false)
			onSuccess?.()
		} finally {
			setPending(false)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>{mode === 'create' ? t('addClass') : t('editClass')}</DialogTitle>
					<DialogDescription>
						{mode === 'create' ? t('addClassDescription') : t('editClassDescription')}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4'
				>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='class-name'>{t('className')}</Label>
						<Input
							id='class-name'
							name='className'
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder={t('classNamePlaceholder')}
							autoComplete='off'
							required
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='class-day'>{t('day')}</Label>
						<select
							id='class-day'
							name='classDay'
							className={selectClassName}
							value={day}
							onChange={(event) => setDay(event.target.value)}
							autoComplete='off'
						>
							{WEEKDAYS.map((weekday) => (
								<option
									key={weekday}
									value={weekday}
								>
									{tWeekdays(weekday)}
								</option>
							))}
						</select>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='class-time'>{t('time')}</Label>
						<Input
							id='class-time'
							name='classTime'
							type='time'
							value={time}
							onChange={(event) => setTime(event.target.value)}
							autoComplete='off'
							required
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='class-max-spots'>{t('maxSpots')}</Label>
						<Input
							id='class-max-spots'
							name='maxSpots'
							type='number'
							min={1}
							max={999}
							inputMode='numeric'
							value={maxSpots}
							onChange={(event) => setMaxSpots(Number(event.target.value) || 1)}
							required
						/>
						{mode === 'edit' && initialClass ? (
							<p className='text-muted-foreground text-xs leading-5'>
								{t('currentEnrolled')}: {initialClass.totalUpcomingBookings}
							</p>
						) : null}
					</div>

					<div className='flex flex-wrap justify-end gap-2 pt-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							{t('cancel')}
						</Button>
						<Button
							type='submit'
							disabled={pending}
						>
							{pending ? t('saving') : mode === 'create' ? t('create') : t('save')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
