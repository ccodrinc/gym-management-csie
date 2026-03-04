'use server'

import { getClassWithBookings } from '@/lib/data'
import { prisma } from '@/lib/db'
import { requireAdmin, revalidateClassesPath } from '@/lib/admin'

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
		const booking = await prisma.classBooking.findUnique({
			where: { id: bookingId },
			include: { gymClass: true }
		})
		if (!booking) return { ok: false, error: 'Booking not found' }
		await prisma.$transaction([
			prisma.classBooking.delete({ where: { id: bookingId } }),
			prisma.gymClass.update({
				where: { id: booking.gymClassId },
				data: { spots: Math.max(0, booking.gymClass.spots - 1) }
			})
		])
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
	date: string,
	time: string
): Promise<AddClassBookingResult> {
	try {
		await requireAdmin()
		const gymClass = await prisma.gymClass.findUnique({ where: { id: gymClassId } })
		if (!gymClass) return { ok: false, error: 'Class not found' }
		if (gymClass.spots >= gymClass.maxSpots) return { ok: false, error: 'Class is full' }
		const existing = await prisma.classBooking.findFirst({
			where: { userId, gymClassId, date }
		})
		if (existing) return { ok: false, error: 'Member already booked for this date' }
		await prisma.$transaction([
			prisma.classBooking.create({
				data: { userId, gymClassId, date, time }
			}),
			prisma.gymClass.update({
				where: { id: gymClassId },
				data: { spots: gymClass.spots + 1 }
			})
		])
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Failed to add' }
	}
}
