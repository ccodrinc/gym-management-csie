'use server'

import { getClassWithBookings } from '@/lib/data'
import { prisma } from '@/lib/db'
import { getNextOccurrenceString, WEEKDAYS } from '@/lib/date'
import { requireAdmin, requireMember, revalidateAppPaths, revalidateClassesPath } from '@/lib/admin'
import { validateBookingRules } from '@/lib/class-bookings'

export type GetClassBookingsResult =
	| { ok: true; data: Awaited<ReturnType<typeof getClassWithBookings>> }
	| { ok: false; error: string }

export async function getClassBookingsAction(gymClassId: string): Promise<GetClassBookingsResult> {
	try {
		await requireAdmin()
		const data = await getClassWithBookings(gymClassId)
		return { ok: true, data }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to load' }
	}
}

export type RemoveClassBookingResult = { ok: true } | { ok: false; error: string }

export async function removeClassBookingAction(bookingId: string): Promise<RemoveClassBookingResult> {
	try {
		await requireAdmin()
		const booking = await prisma.classBooking.findUnique({ where: { id: bookingId } })
		if (!booking) return { ok: false, error: 'Booking not found' }
		await prisma.classBooking.delete({ where: { id: bookingId } })
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to remove' }
	}
}

export type AddClassBookingResult = { ok: true } | { ok: false; error: string }

export async function addClassBookingAction(
	userId: string,
	gymClassId: string,
	date: string
): Promise<AddClassBookingResult> {
	try {
		await requireAdmin()
		const validation = await validateBookingRules(userId, gymClassId, date)
		if (!validation.ok) return validation
		await prisma.classBooking.create({
			data: { userId, gymClassId, date, time: validation.time }
		})
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to add' }
	}
}

export async function bookOwnClassAction(gymClassId: string): Promise<AddClassBookingResult> {
	try {
		const userId = await requireMember()
		const gymClass = await prisma.gymClass.findUnique({
			where: { id: gymClassId },
			select: { id: true, day: true }
		})
		if (!gymClass) return { ok: false, error: 'Class not found' }
		if (!WEEKDAYS.includes(gymClass.day as (typeof WEEKDAYS)[number])) {
			return { ok: false, error: 'Class schedule is invalid' }
		}

		const date = getNextOccurrenceString(gymClass.day as (typeof WEEKDAYS)[number])
		const validation = await validateBookingRules(userId, gymClassId, date)
		if (!validation.ok) return validation

		await prisma.classBooking.create({
			data: { userId, gymClassId, date, time: validation.time }
		})
		revalidateAppPaths(['/member/classes', '/member'])
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to book class' }
	}
}

export async function cancelOwnClassBookingAction(
	bookingId: string
): Promise<RemoveClassBookingResult> {
	try {
		const userId = await requireMember()
		const booking = await prisma.classBooking.findUnique({
			where: { id: bookingId },
			select: { id: true, userId: true }
		})
		if (!booking || booking.userId !== userId) {
			return { ok: false, error: 'Booking not found' }
		}

		await prisma.classBooking.delete({ where: { id: bookingId } })
		revalidateAppPaths(['/member/classes', '/member'])
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to cancel booking' }
	}
}
