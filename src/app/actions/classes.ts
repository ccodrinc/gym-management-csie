'use server'

import { z } from 'zod'

import { prisma } from '@/lib/db'
import { requireAdmin, revalidateClassesPath } from '@/lib/admin'
import { getTodayString, WEEKDAYS } from '@/lib/date'

export type CreateClassResult = { ok: true; id: string } | { ok: false; error: string }

const classSchema = z.object({
	name: z.string().trim().min(2, 'Class name must be at least 2 characters'),
	day: z.enum(WEEKDAYS),
	time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must use the HH:MM format'),
	maxSpots: z
		.number()
		.int()
		.min(1, 'Max spots must be between 1 and 999')
		.max(999, 'Max spots must be between 1 and 999')
})

export async function createGymClassAction(
	name: string,
	day: string,
	time: string,
	maxSpots: number
): Promise<CreateClassResult> {
	try {
		await requireAdmin()
		const payload = classSchema.safeParse({
			name,
			day: day.trim(),
			time: time.trim().slice(0, 5),
			maxSpots
		})
		if (!payload.success) {
			return { ok: false, error: payload.error.issues[0]?.message ?? 'Invalid class data' }
		}
		const created = await prisma.gymClass.create({
			data: payload.data
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
		const currentEnrollments = await prisma.classBooking.count({
			where: { gymClassId: id, date: { gte: getTodayString() } }
		})
		const payload = classSchema.safeParse({
			name,
			day: day.trim(),
			time: time.trim().slice(0, 5),
			maxSpots
		})
		if (!payload.success) {
			return { ok: false, error: payload.error.issues[0]?.message ?? 'Invalid class data' }
		}
		if (payload.data.maxSpots < currentEnrollments) {
			return { ok: false, error: 'Max spots cannot be less than current enrollments' }
		}
		await prisma.gymClass.update({
			where: { id },
			data: payload.data
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
		const gymClass = await prisma.gymClass.findUnique({ where: { id }, select: { id: true } })
		if (!gymClass) return { ok: false, error: 'Class not found' }
		await prisma.gymClass.delete({ where: { id } })
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to delete class' }
	}
}
