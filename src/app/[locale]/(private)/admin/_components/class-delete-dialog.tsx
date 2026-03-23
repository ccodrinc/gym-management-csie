'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { deleteGymClassAction } from '@/app/actions/classes'
import { Button } from '@/components/ui/button'
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

export function ClassDeleteDialog({ open, onOpenChange, class: gymClass, onSuccess }: ClassDeleteDialogProps) {
	const t = useTranslations('Admin.classes')
	const [pending, setPending] = useState(false)

	async function handleConfirm() {
		if (!gymClass) {
			return
		}

		setPending(true)

		try {
			const result = await deleteGymClassAction(gymClass.id)

			if (!result.ok) {
				toast.error(result.error)
				return
			}

			toast.success(t('classDeleted'))
			onOpenChange(false)
			onSuccess?.()
		} finally {
			setPending(false)
		}
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t('deleteClassTitle')}</AlertDialogTitle>
					<AlertDialogDescription>{t('deleteClassDescription', { name: gymClass?.name ?? '' })}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>{t('cancel')}</AlertDialogCancel>
					<AlertDialogAction
						asChild
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
					>
						<Button
							type='button'
							onClick={handleConfirm}
							disabled={pending}
						>
							{pending ? t('deleting') : t('delete')}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
