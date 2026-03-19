import { getTranslations } from 'next-intl/server'

import { prisma } from '@/lib/db'
import { getTodayString, toDateString, WEEKDAYS } from '@/lib/date'
import { Role } from '@prisma/client'

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
	const monthStart = new Date()
	monthStart.setDate(1)
	monthStart.setHours(0, 0, 0, 0)
	const monthStartStr = toDateString(monthStart)

	const [totalMembers, todayVisits, newMembers, membersByType, allVisits, tWeekdays, tMembership] =
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
			_count: { _all: true }
		}),
		getTranslations({ locale, namespace: 'Weekdays' }),
		getTranslations({ locale, namespace: 'MembershipMeta' })
	])

	const activeToday = todayVisits.length

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const visitsByDay: Record<string, number> = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]))

	for (const v of allVisits) {
		const d = new Date(v.date + 'T12:00:00')
		const day = dayNames[d.getDay()]
		visitsByDay[day] = (visitsByDay[day] ?? 0) + v._count._all
	}
	const visitsPerDay = WEEKDAYS.map((day) => ({ day: tWeekdays(day), visits: visitsByDay[day] ?? 0 }))

	const totalVisits = allVisits.reduce((sum, v) => sum + v._count._all, 0)
	const uniqueDays = allVisits.length
	const avgCheckinsPerDay = uniqueDays > 0 ? Math.round(totalVisits / uniqueDays) : 0

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
