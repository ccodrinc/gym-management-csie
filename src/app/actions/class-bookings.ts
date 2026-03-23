'use server'

import { getTranslations } from 'next-intl/server'

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
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToLoad') }
	}
}

export type RemoveClassBookingResult = { ok: true } | { ok: false; error: string }

export async function removeClassBookingAction(bookingId: string): Promise<RemoveClassBookingResult> {
	try {
		const t = await getTranslations('Actions.classBookings')
		await requireAdmin()
		const booking = await prisma.classBooking.findUnique({ where: { id: bookingId } })
		if (!booking) return { ok: false, error: t('bookingNotFound') }
		await prisma.classBooking.delete({ where: { id: bookingId } })
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToRemove') }
	}
}

export type AddClassBookingResult = { ok: true } | { ok: false; error: string }

async function createBooking(userId: string, gymClassId: string, date: string): Promise<void> {
	const validation = await validateBookingRules(userId, gymClassId, date)
	if (!validation.ok) {
		throw new Error(validation.error)
	}

	await prisma.classBooking.create({
		data: { userId, gymClassId, date, time: validation.time }
	})
}

export async function addClassBookingAction(
	userId: string,
	gymClassId: string,
	date: string
): Promise<AddClassBookingResult> {
	try {
		await requireAdmin()
		await createBooking(userId, gymClassId, date)
		revalidateClassesPath()
		return { ok: true }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToAdd') }
	}
}

export async function bookOwnClassAction(gymClassId: string): Promise<AddClassBookingResult> {
	try {
		const t = await getTranslations('Actions.classBookings')
		const userId = await requireMember()
		const gymClass = await prisma.gymClass.findUnique({
			where: { id: gymClassId },
			select: { id: true, day: true }
		})
		if (!gymClass) return { ok: false, error: t('classNotFound') }
		if (!WEEKDAYS.includes(gymClass.day as (typeof WEEKDAYS)[number])) {
			return { ok: false, error: t('classScheduleInvalid') }
		}

		const date = getNextOccurrenceString(gymClass.day as (typeof WEEKDAYS)[number])
		await createBooking(userId, gymClassId, date)
		revalidateAppPaths(['/member/classes', '/member'])
		return { ok: true }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToBookClass') }
	}
}

export async function cancelOwnClassBookingAction(bookingId: string): Promise<RemoveClassBookingResult> {
	try {
		const t = await getTranslations('Actions.classBookings')
		const userId = await requireMember()
		const booking = await prisma.classBooking.findUnique({
			where: { id: bookingId },
			select: { id: true, userId: true }
		})
		if (!booking || booking.userId !== userId) {
			return { ok: false, error: t('bookingNotFound') }
		}

		await prisma.classBooking.delete({ where: { id: bookingId } })
		revalidateAppPaths(['/member/classes', '/member'])
		return { ok: true }
	} catch (err) {
		const tCommon = await getTranslations('Actions.common')
		return { ok: false, error: err instanceof Error ? err.message : tCommon('failedToCancelBooking') }
	}
}
