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

	const [totalMembers, todayVisits, newMembers, allVisits, membersByType] = await Promise.all([
		prisma.user.count({ where: { role: Role.MEMBER } }),
		prisma.visit.groupBy({ by: ['userId'], where: { date: today } }),
		prisma.user.count({
			where: { role: Role.MEMBER, startDate: { gte: monthStartStr } }
		}),
		prisma.visit.findMany({ select: { date: true } }),
		prisma.user.groupBy({
			by: ['membershipType'],
			where: { role: Role.MEMBER },
			_count: true
		})
	])

	const activeToday = todayVisits.length

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const visitsByDay: Record<string, number> = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]))
	for (const v of allVisits) {
		const d = new Date(v.date + 'T12:00:00')
		const day = dayNames[d.getDay()]
		visitsByDay[day] = (visitsByDay[day] ?? 0) + 1
	}
	const visitsPerDay = WEEKDAYS.map((day) => ({ day, visits: visitsByDay[day] ?? 0 }))

	const totalVisits = allVisits.length
	const uniqueDays = new Set(allVisits.map((v) => v.date)).size
	const avgCheckinsPerDay = uniqueDays > 0 ? Math.round(totalVisits / uniqueDays) : 0

	const membershipBreakdown = membersByType.map((m) => ({
		type: formatMembershipType(m.membershipType),
		count: m._count
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
