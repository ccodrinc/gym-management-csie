'use client'

import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { ClassDeleteDialog } from '@/app/[locale]/(private)/admin/_components/class-delete-dialog'
import { ClassEnrollmentsDialog } from '@/app/[locale]/(private)/admin/_components/class-enrollments-dialog'
import { ClassFormDialog } from '@/app/[locale]/(private)/admin/_components/class-form-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import type { GymClass, Member } from '@/lib/data'
import { formatDate } from '@/lib/format'

type AdminClassesContentProps = {
	classes: GymClass[]
	members: Member[]
}

export function AdminClassesContent({ classes, members }: AdminClassesContentProps) {
	const locale = useLocale()
	const t = useTranslations('Admin.classes')
	const tWeekdays = useTranslations('Weekdays')
	const router = useRouter()
	const [enrollmentsOpen, setEnrollmentsOpen] = useState(false)
	const [selectedClass, setSelectedClass] = useState<GymClass | null>(null)
	const [formOpen, setFormOpen] = useState(false)
	const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
	const [formClass, setFormClass] = useState<GymClass | null>(null)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [deleteClass, setDeleteClass] = useState<GymClass | null>(null)

	function refresh() {
		router.refresh()
	}

	function openEnrollments(gymClass: GymClass) {
		setSelectedClass(gymClass)
		setEnrollmentsOpen(true)
	}

	function openAddClass() {
		setFormMode('create')
		setFormClass(null)
		setFormOpen(true)
	}

	function openEditClass(gymClass: GymClass) {
		setFormMode('edit')
		setFormClass(gymClass)
		setFormOpen(true)
	}

	function openDeleteClass(gymClass: GymClass) {
		setDeleteClass(gymClass)
		setDeleteOpen(true)
	}

	return (
		<>
			<div className='flex flex-col gap-3'>
				<div className='flex justify-end'>
					<Button
						type='button'
						onClick={openAddClass}
						size='sm'
					>
						<Plus data-icon='inline-start' />
						{t('addClass')}
					</Button>
				</div>

				{classes.length ? (
					<div className='flex flex-col gap-3'>
						{classes.map((gymClass) => (
							<div
								key={gymClass.id}
								className='bg-card flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between'
							>
								<div className='flex min-w-0 flex-col gap-1'>
									<p className='font-medium'>{gymClass.name}</p>
									<p className='text-muted-foreground text-sm'>
										{tWeekdays(gymClass.day)} · {gymClass.time}
									</p>
									<p className='text-muted-foreground text-xs leading-5'>
										{t('nextSession')}: {formatDate(gymClass.nextSessionDate, locale)}
									</p>
								</div>

								<div className='flex flex-wrap items-center gap-2 lg:justify-end'>
									<p className='text-muted-foreground mr-2 text-sm'>
										{gymClass.nextSessionBookings}/{gymClass.maxSpots} {t('spots')}
									</p>

									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={() => openEnrollments(gymClass)}
										aria-label={`${t('enrollments')} ${gymClass.name}`}
									>
										<Users data-icon='inline-start' />
										{t('enrollments')}
									</Button>

									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={() => openEditClass(gymClass)}
										aria-label={`${t('edit')} ${gymClass.name}`}
									>
										<Pencil data-icon='inline-start' />
										{t('edit')}
									</Button>

									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={() => openDeleteClass(gymClass)}
										aria-label={`${t('delete')} ${gymClass.name}`}
										className='text-destructive hover:text-destructive'
									>
										<Trash2 data-icon='inline-start' />
										{t('delete')}
									</Button>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-muted-foreground rounded-xl border border-dashed p-6 text-sm'>{t('noClasses')}</p>
				)}
			</div>

			<ClassEnrollmentsDialog
				key={`${selectedClass?.id ?? 'none'}:${enrollmentsOpen ? 'open' : 'closed'}`}
				open={enrollmentsOpen}
				onOpenChange={(open) => {
					setEnrollmentsOpen(open)
					if (!open) {
						setSelectedClass(null)
					}
				}}
				gymClassId={selectedClass?.id ?? null}
				className={selectedClass?.name ?? ''}
				classDay={selectedClass?.day ?? ''}
				classTime={selectedClass?.time ?? ''}
				members={members}
			/>

			<ClassFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				mode={formMode}
				class={formClass}
				onSuccess={refresh}
			/>

			<ClassDeleteDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				class={deleteClass}
				onSuccess={refresh}
			/>
		</>
	)
}
