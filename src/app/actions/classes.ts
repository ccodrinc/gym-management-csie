'use server'

import { prisma } from '@/lib/db'
import { requireAdmin, revalidateClassesPath } from '@/lib/admin'
import { WEEKDAYS } from '@/lib/date'

export type CreateClassResult = { ok: true; id: string } | { ok: false; error: string }

export async function createGymClassAction(
	name: string,
	day: string,
	time: string,
	maxSpots: number
): Promise<CreateClassResult> {
	try {
		await requireAdmin()
		const dayTrim = day.trim()
		if (!WEEKDAYS.includes(dayTrim as (typeof WEEKDAYS)[number])) {
			return { ok: false, error: 'Invalid day' }
		}
		if (maxSpots < 1 || maxSpots > 999) {
			return { ok: false, error: 'Max spots must be between 1 and 999' }
		}
		const timeNorm = time.trim().slice(0, 5)
		const created = await prisma.gymClass.create({
			data: { name: name.trim(), day: dayTrim, time: timeNorm, spots: 0, maxSpots }
		})
		revalidateClassesPath()
		return { ok: true, id: created.id }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to create class' }
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
		await requireAdmin()
		const existing = await prisma.gymClass.findUnique({ where: { id } })
		if (!existing) return { ok: false, error: 'Class not found' }
		const dayTrim = day.trim()
		if (!WEEKDAYS.includes(dayTrim as (typeof WEEKDAYS)[number])) {
			return { ok: false, error: 'Invalid day' }
		}
		if (maxSpots < 1 || maxSpots > 999) {
			return { ok: false, error: 'Max spots must be between 1 and 999' }
		}
		if (maxSpots < existing.spots) {
			return { ok: false, error: 'Max spots cannot be less than current enrollments' }
		}
		const timeNorm = time.trim().slice(0, 5)
		await prisma.gymClass.update({
			where: { id },
			data: { name: name.trim(), day: dayTrim, time: timeNorm, maxSpots }
		})
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to update class' }
	}
}

export type DeleteClassResult = { ok: true } | { ok: false; error: string }

export async function deleteGymClassAction(id: string): Promise<DeleteClassResult> {
	try {
		await requireAdmin()
		await prisma.gymClass.delete({ where: { id } })
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to delete class' }
	}
}
