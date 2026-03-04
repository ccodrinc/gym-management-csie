'use client'

import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { ClassEnrollmentsDialog } from '@/components/admin/class-enrollments-dialog'
import type { GymClass } from '@/lib/data'
import type { Member } from '@/lib/data'
import { Button } from '@/components/ui/button'

type AdminClassesContentProps = {
	classes: GymClass[]
	members: Member[]
}

export function AdminClassesContent({ classes, members }: AdminClassesContentProps) {
	const t = useTranslations('Admin.classes')
	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedClass, setSelectedClass] = useState<GymClass | null>(null)

	function openDialog(cls: GymClass) {
		setSelectedClass(cls)
		setDialogOpen(true)
	}

	return (
		<>
			<div className='space-y-3'>
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
						</div>
						<div className='flex items-center gap-2'>
							<p className='text-sm'>
								{cls.spots}/{cls.maxSpots} {t('spots')}
							</p>
							<Button
								variant='outline'
								size='sm'
								onClick={() => openDialog(cls)}
								aria-label={`${t('enrollments')} ${cls.name}`}
							>
								<Users className='size-4' />
								{t('enrollments')}
							</Button>
						</div>
					</div>
				))}
			</div>

			<ClassEnrollmentsDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				gymClassId={selectedClass?.id ?? null}
				className={selectedClass?.name ?? ''}
				classDay={selectedClass?.day ?? ''}
				classTime={selectedClass?.time ?? ''}
				members={members}
			/>
		</>
	)
}
