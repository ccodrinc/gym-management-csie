import { getSession } from '@/auth'
import { prisma } from '@/lib/db'
import { formatMembershipType } from '@/lib/format'
import { getTodayString, toDateString, WEEKDAYS } from '@/lib/date'
import { Role } from '@prisma/client'

export type Member = {
	id: string
	name: string | null
	username: string
	membershipType: string
	isActive: boolean
	startDate: string | null
	expiryDate: string | null
	gymVisits: number
}

export type CurrentMember = {
	id: string
	name: string | null
	username: string
	phone: string | null
	membershipType: string
	isActive: boolean
	startDate: string | null
	expiryDate: string | null
	gymVisits: number
	recentVisits: { date: string; time: string }[]
	visitHistory: { date: string; time: string }[]
	visitsThisWeek: { day: string; count: number }[]
	upcomingClasses: { name: string; date: string; time: string }[]
}

function isActive(expiryDate: string | null): boolean {
	if (!expiryDate) return false
	return new Date(expiryDate) >= new Date()
}

export async function getCurrentMember(): Promise<CurrentMember> {
	const session = await getSession()
	const userId = session?.user?.id ?? null
	if (!userId) throw new Error('Unauthorized')

	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			visits: { orderBy: [{ date: 'desc' }, { time: 'desc' }], take: 50 },
			classBookings: {
				where: { date: { gte: getTodayString() } },
				include: { gymClass: true }
			}
		}
	})
	if (!user) throw new Error('Member not found')

	const visitHistory = user.visits.map((v) => ({ date: v.date, time: v.time }))
	const recentVisits = visitHistory.slice(0, 5)

	const today = new Date()
	const dayOfWeek = today.getDay()
	const monOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
	const weekStart = new Date(today)
	weekStart.setDate(today.getDate() + monOffset)

	const visitsThisWeek = WEEKDAYS.map((day, i) => {
		const d = new Date(weekStart)
		d.setDate(weekStart.getDate() + i)
		const dateStr = toDateString(d)
		const count = user.visits.filter((v) => v.date === dateStr).length
		return { day, count }
	})

	const upcomingClasses = user.classBookings.map((b) => ({
		name: b.gymClass.name,
		date: b.date,
		time: b.time
	}))

	return {
		id: user.id,
		name: user.name,
		username: user.username,
		phone: user.phone,
		membershipType: formatMembershipType(user.membershipType),
		isActive: isActive(user.expiryDate),
		startDate: user.startDate,
		expiryDate: user.expiryDate,
		gymVisits: user.gymVisits,
		recentVisits,
		visitHistory,
		visitsThisWeek,
		upcomingClasses
	}
}

export async function getMembers(): Promise<Member[]> {
	const users = await prisma.user.findMany({
		where: { role: Role.MEMBER },
		orderBy: { name: 'asc' }
	})
	return users.map((u) => ({
		id: u.id,
		name: u.name,
		username: u.username,
		membershipType: formatMembershipType(u.membershipType),
		isActive: isActive(u.expiryDate),
		startDate: u.startDate,
		expiryDate: u.expiryDate,
		gymVisits: u.gymVisits
	}))
}
