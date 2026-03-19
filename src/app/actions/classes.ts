'use server'

import { z } from 'zod'
import { getTranslations } from 'next-intl/server'

import { prisma } from '@/lib/db'
import { requireAdmin, revalidateClassesPath } from '@/lib/admin'
import { getTodayString, WEEKDAYS } from '@/lib/date'

export type CreateClassResult = { ok: true; id: string } | { ok: false; error: string }

function createClassSchema(t: Awaited<ReturnType<typeof getTranslations>>) {
	return z.object({
		name: z.string().trim().min(2, t('classNameMin')),
		day: z.enum(WEEKDAYS),
		time: z.string().regex(/^\d{2}:\d{2}$/, t('timeFormat')),
		maxSpots: z.number().int().min(1, t('maxSpotsRange')).max(999, t('maxSpotsRange'))
	})
}

export async function createGymClassAction(
	name: string,
	day: string,
	time: string,
	maxSpots: number
): Promise<CreateClassResult> {
	try {
		const t = await getTranslations('Actions.classes')
		await requireAdmin()
		const classSchema = createClassSchema(t)
		const payload = classSchema.safeParse({
			name,
			day: day.trim(),
			time: time.trim().slice(0, 5),
			maxSpots
		})
		if (!payload.success) {
			return { ok: false, error: payload.error.issues[0]?.message ?? t('invalidClassData') }
		}
		const created = await prisma.gymClass.create({
			data: payload.data
		})
		revalidateClassesPath()
		return { ok: true, id: created.id }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToCreateClass') }
	}
}

export type UpdateClassResult = { ok: true } | { ok: false; error: string }

export async function updateGymClassAction(
	id: string,
	name: string,
	day: string,
	time: string,
	maxSpots: number
): Promise<UpdateClassResult> {
	try {
		const t = await getTranslations('Actions.classes')
		await requireAdmin()
		const existing = await prisma.gymClass.findUnique({ where: { id } })
		if (!existing) return { ok: false, error: t('classNotFound') }
		const currentEnrollments = await prisma.classBooking.count({
			where: { gymClassId: id, date: { gte: getTodayString() } }
		})
		const classSchema = createClassSchema(t)
		const payload = classSchema.safeParse({
			name,
			day: day.trim(),
			time: time.trim().slice(0, 5),
			maxSpots
		})
		if (!payload.success) {
			return { ok: false, error: payload.error.issues[0]?.message ?? t('invalidClassData') }
		}
		if (payload.data.maxSpots < currentEnrollments) {
			return { ok: false, error: t('maxSpotsBelowEnrollments') }
		}
		await prisma.gymClass.update({
			where: { id },
			data: payload.data
		})
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToUpdateClass') }
	}
}

export type DeleteClassResult = { ok: true } | { ok: false; error: string }

export async function deleteGymClassAction(id: string): Promise<DeleteClassResult> {
	try {
		const t = await getTranslations('Actions.classes')
		await requireAdmin()
		const gymClass = await prisma.gymClass.findUnique({ where: { id }, select: { id: true } })
		if (!gymClass) return { ok: false, error: t('classNotFound') }
		await prisma.gymClass.delete({ where: { id } })
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToDeleteClass') }
	}
}
