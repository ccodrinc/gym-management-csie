'use client'

import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { ClassDeleteDialog } from '@/components/admin/class-delete-dialog'
import { ClassEnrollmentsDialog } from '@/components/admin/class-enrollments-dialog'
import { ClassFormDialog } from '@/components/admin/class-form-dialog'
import type { GymClass } from '@/lib/data'
import type { Member } from '@/lib/data'
import { Button } from '@/components/ui/button'

type AdminClassesContentProps = {
	classes: GymClass[]
	members: Member[]
}

export function AdminClassesContent({ classes, members }: AdminClassesContentProps) {
	const t = useTranslations('Admin.classes')
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

	function openEnrollments(cls: GymClass) {
		setSelectedClass(cls)
		setEnrollmentsOpen(true)
	}

	function openAddClass() {
		setFormMode('create')
		setFormClass(null)
		setFormOpen(true)
	}

	function openEditClass(cls: GymClass) {
		setFormMode('edit')
		setFormClass(cls)
		setFormOpen(true)
	}

	function openDeleteClass(cls: GymClass) {
		setDeleteClass(cls)
		setDeleteOpen(true)
	}

	return (
		<>
			<div className='space-y-3'>
				<div className='flex justify-end'>
					<Button onClick={openAddClass} size='sm'>
						<Plus className='size-4' />
						{t('addClass')}
					</Button>
				</div>
				{classes.map((cls) => (
					<div
						key={cls.id}
						className='flex flex-wrap items-center justify-between gap-2 rounded-md border px-4 py-3'
					>
						<div>
							<p className='font-medium'>{cls.name}</p>
							<p className='text-muted-foreground text-sm'>
								{cls.day} · {cls.time}
							</p>
							<p className='text-muted-foreground text-xs'>
								{t('nextSession')}: {cls.nextSessionDate}
							</p>
						</div>
						<div className='flex items-center gap-2'>
							<p className='text-sm'>
								{cls.nextSessionBookings}/{cls.maxSpots} {t('spots')}
							</p>
							<Button
								variant='outline'
								size='sm'
								onClick={() => openEnrollments(cls)}
								aria-label={`${t('enrollments')} ${cls.name}`}
							>
								<Users className='size-4' />
								{t('enrollments')}
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => openEditClass(cls)}
								aria-label={`${t('edit')} ${cls.name}`}
							>
								<Pencil className='size-4' />
								{t('edit')}
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => openDeleteClass(cls)}
								aria-label={`${t('delete')} ${cls.name}`}
								className='text-destructive hover:text-destructive'
							>
								<Trash2 className='size-4' />
								{t('delete')}
							</Button>
						</div>
					</div>
				))}
			</div>

			<ClassEnrollmentsDialog
				open={enrollmentsOpen}
				onOpenChange={setEnrollmentsOpen}
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
