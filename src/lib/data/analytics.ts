import { prisma } from '@/lib/db'
import { formatMembershipType } from '@/lib/format'
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

export async function getAnalytics(): Promise<Analytics> {
	const today = getTodayString()
	const monthStart = new Date()
	monthStart.setDate(1)
	monthStart.setHours(0, 0, 0, 0)
	const monthStartStr = toDateString(monthStart)

	const [totalMembers, todayVisits, newMembers, visitDates, membersByType] = await Promise.all([
		prisma.user.count({ where: { role: Role.MEMBER } }),
		prisma.visit.groupBy({ by: ['userId'], where: { date: today } }),
		prisma.user.count({
			where: { role: Role.MEMBER, startDate: { gte: monthStartStr } }
		}),
		prisma.visit.findMany({
			select: { date: true },
			distinct: ['date']
		}),
		prisma.user.groupBy({
			by: ['membershipType'],
			where: { role: Role.MEMBER },
			_count: { _all: true }
		})
	])

	const activeToday = todayVisits.length

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const visitsByDay: Record<string, number> = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]))

	const allVisits = await prisma.visit.groupBy({
		by: ['date'],
		_count: { _all: true }
	})
	for (const v of allVisits) {
		const d = new Date(v.date + 'T12:00:00')
		const day = dayNames[d.getDay()]
		visitsByDay[day] = (visitsByDay[day] ?? 0) + v._count._all
	}
	const visitsPerDay = WEEKDAYS.map((day) => ({ day, visits: visitsByDay[day] ?? 0 }))

	const totalVisits = allVisits.reduce((sum, v) => sum + v._count._all, 0)
	const uniqueDays = visitDates.length
	const avgCheckinsPerDay = uniqueDays > 0 ? Math.round(totalVisits / uniqueDays) : 0

	const membershipBreakdown = membersByType.map((m) => ({
		type: formatMembershipType(m.membershipType),
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
