import { getSession } from '@/auth'
import { getTodayString, toDateString, WEEKDAYS } from '@/lib/date'
import { prisma } from '@/lib/db'
import { formatMembershipStatus, formatMembershipType } from '@/lib/format'
import { getEffectiveMembershipStatus, isMembershipActive } from '@/lib/membership'
import { MembershipStatus, MembershipType, Role } from '@prisma/client'

export type Member = {
	id: string
	name: string | null
	username: string
	membershipType: string
	membershipTypeKey: MembershipType | null
	membershipStatus: string
	membershipStatusKey: MembershipStatus
	isActive: boolean
	startDate: string | null
	expiryDate: string | null
	gymVisits: number
	visitHistory?: { date: string; time: string }[]
}

export type CurrentMember = {
	id: string
	name: string | null
	username: string
	phone: string | null
	membershipType: string
	membershipTypeKey: MembershipType | null
	membershipStatus: string
	membershipStatusKey: MembershipStatus
	isActive: boolean
	startDate: string | null
	expiryDate: string | null
	gymVisits: number
	recentVisits: { date: string; time: string }[]
	visitHistory: { date: string; time: string }[]
	visitsThisWeek: { day: string; count: number }[]
	upcomingClasses: {
		id: string
		gymClassId: string
		name: string
		day: string
		date: string
		time: string
	}[]
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
				include: { gymClass: true },
				orderBy: [{ date: 'asc' }, { time: 'asc' }]
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
		id: b.id,
		gymClassId: b.gymClassId,
		name: b.gymClass.name,
		day: b.gymClass.day,
		date: b.date,
		time: b.time
	}))
	const membershipStatus = getEffectiveMembershipStatus(user.membershipStatus, user.expiryDate)

	return {
		id: user.id,
		name: user.name,
		username: user.username,
		phone: user.phone,
		membershipType: formatMembershipType(user.membershipType),
		membershipTypeKey: user.membershipType,
		membershipStatus: formatMembershipStatus(membershipStatus),
		membershipStatusKey: membershipStatus,
		isActive: isMembershipActive(user.membershipStatus, user.expiryDate),
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
		orderBy: [{ name: 'asc' }, { username: 'asc' }],
		include: {
			visits: { orderBy: [{ date: 'desc' }, { time: 'desc' }] }
		}
	})
	return users.map((u) => ({
		id: u.id,
		name: u.name,
		username: u.username,
		membershipType: formatMembershipType(u.membershipType),
		membershipTypeKey: u.membershipType,
		membershipStatus: formatMembershipStatus(
			getEffectiveMembershipStatus(u.membershipStatus, u.expiryDate)
		),
		membershipStatusKey: getEffectiveMembershipStatus(u.membershipStatus, u.expiryDate),
		isActive: isMembershipActive(u.membershipStatus, u.expiryDate),
		startDate: u.startDate,
		expiryDate: u.expiryDate,
		gymVisits: u.gymVisits,
		visitHistory: u.visits.map((v) => ({ date: v.date, time: v.time }))
	}))
}
