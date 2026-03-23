import { getTranslations } from 'next-intl/server'

import { Role } from '@/generated/prisma/client'
import { prisma } from '@/lib/db'
import { getRecentDateStrings, getTodayString, parseStoredDate, toDateString } from '@/lib/date'

export type Analytics = {
	totalMembers: number
	activeToday: number
	newThisMonth: number
	avgCheckinsPerDay: number
	visitsPerDay: { day: string; visits: number }[]
	membershipBreakdown: { type: string; count: number }[]
}

export async function getAnalytics(locale: string): Promise<Analytics> {
	const today = getTodayString()
	const recentDates = getRecentDateStrings(7)
	const monthStart = new Date()
	monthStart.setDate(1)
	monthStart.setHours(0, 0, 0, 0)
	const monthStartStr = toDateString(monthStart)

	const [totalMembers, todayVisits, newMembers, membersByType, recentVisits, tWeekdays, tMembership] =
		await Promise.all([
			prisma.user.count({ where: { role: Role.MEMBER } }),
			prisma.visit.groupBy({ by: ['userId'], where: { date: today } }),
			prisma.user.count({
				where: { role: Role.MEMBER, startDate: { gte: monthStartStr } }
			}),
			prisma.user.groupBy({
				by: ['membershipType'],
				where: { role: Role.MEMBER },
				_count: { _all: true }
			}),
			prisma.visit.groupBy({
				by: ['date'],
				where: { date: { in: recentDates } },
				_count: { _all: true }
			}),
			getTranslations({ locale, namespace: 'Weekdays' }),
			getTranslations({ locale, namespace: 'MembershipMeta' })
		])

	const activeToday = todayVisits.length

	const visitsByDate = Object.fromEntries(recentVisits.map((visit) => [visit.date, visit._count._all]))
	const visitsPerDay = recentDates.map((date) => {
		const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(parseStoredDate(date))
		return {
			day: tWeekdays(weekday),
			visits: visitsByDate[date] ?? 0
		}
	})
	const totalVisits = visitsPerDay.reduce((sum, day) => sum + day.visits, 0)
	const avgCheckinsPerDay = Math.round(totalVisits / recentDates.length)

	const membershipBreakdown = membersByType.map((m) => ({
		type: m.membershipType ? tMembership(`types.${m.membershipType}`) : tMembership('types.none'),
		count: m._count._all
	}))

	return {
		totalMembers,
		activeToday,
		newThisMonth: newMembers,
		avgCheckinsPerDay,
		visitsPerDay,
		membershipBreakdown
	}
}
