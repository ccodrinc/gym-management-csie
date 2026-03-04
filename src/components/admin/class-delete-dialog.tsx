'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteGymClassAction } from '@/app/actions/classes'
import type { GymClass } from '@/lib/data'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'

type ClassDeleteDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	class: GymClass | null
	onSuccess?: () => void
}

export function ClassDeleteDialog({
	open,
	onOpenChange,
	class: gymClass,
	onSuccess
}: ClassDeleteDialogProps) {
	const t = useTranslations('Admin.classes')
	const [pending, setPending] = useState(false)

	async function handleConfirm() {
		if (!gymClass) return
		setPending(true)
		try {
			const result = await deleteGymClassAction(gymClass.id)
			if (result.ok) {
				toast.success(t('classDeleted'))
				onOpenChange(false)
				onSuccess?.()
			} else {
				toast.error(result.error)
			}
		} finally {
			setPending(false)
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t('deleteClassTitle')}</AlertDialogTitle>
					<AlertDialogDescription>
						{t('deleteClassDescription', { name: gymClass?.name ?? '' })}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>{t('cancel')}</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault()
							handleConfirm()
						}}
						disabled={pending}
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
					>
						{pending ? t('deleting') : t('delete')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
