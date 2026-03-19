import { Role } from '@prisma/client'
import { getTranslations } from 'next-intl/server'

import { MAX_MEMBER_CLASS_ENROLLMENTS } from '@/lib/constants'
import { getTodayString, WEEKDAYS } from '@/lib/date'
import { prisma } from '@/lib/db'
import { isMembershipActive } from '@/lib/membership'

function isBookingDateMatchingClassDay(date: string, classDay: string): boolean {
	const parsedDate = new Date(`${date}T12:00:00`)
	const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parsedDate.getDay()]
	return weekday === classDay
}

export async function validateBookingRules(
	userId: string,
	gymClassId: string,
	date: string
): Promise<{ ok: true; time: string } | { ok: false; error: string }> {
	const today = getTodayString()
	const [t, tWeekdays] = await Promise.all([
		getTranslations('Actions.classBookings'),
		getTranslations('Weekdays')
	])
	const [user, gymClass, upcomingBookingsCount, existingBooking, sessionBookingsCount] =
		await Promise.all([
			prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					role: true,
					membershipStatus: true,
					expiryDate: true
				}
			}),
			prisma.gymClass.findUnique({
				where: { id: gymClassId },
				select: { id: true, day: true, time: true, maxSpots: true }
			}),
			prisma.classBooking.count({
				where: {
					userId,
					date: { gte: today }
				}
			}),
			prisma.classBooking.findUnique({
				where: {
					userId_gymClassId_date: {
						userId,
						gymClassId,
						date
					}
				},
				select: { id: true }
			}),
			prisma.classBooking.count({
				where: {
					gymClassId,
					date
				}
			})
		])

	if (!user || user.role !== Role.MEMBER) {
		return { ok: false, error: t('memberNotFound') }
	}

	if (!gymClass) {
		return { ok: false, error: t('classNotFound') }
	}

	if (date < today) {
		return { ok: false, error: t('mustBeTodayOrLater') }
	}

	if (!WEEKDAYS.includes(gymClass.day as (typeof WEEKDAYS)[number])) {
		return { ok: false, error: t('classScheduleInvalid') }
	}

	if (!isBookingDateMatchingClassDay(date, gymClass.day)) {
		return { ok: false, error: t('selectedDateMustMatch', { day: tWeekdays(gymClass.day) }) }
	}

	if (!isMembershipActive(user.membershipStatus, user.expiryDate)) {
		return { ok: false, error: t('activeMembershipRequired') }
	}

	if (existingBooking) {
		return { ok: false, error: t('alreadyEnrolled') }
	}

	if (upcomingBookingsCount >= MAX_MEMBER_CLASS_ENROLLMENTS) {
		return {
			ok: false,
			error: t('upcomingLimit', { count: MAX_MEMBER_CLASS_ENROLLMENTS })
		}
	}

	if (sessionBookingsCount >= gymClass.maxSpots) {
		return { ok: false, error: t('classFull') }
	}

	return { ok: true, time: gymClass.time }
}
