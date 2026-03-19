import { getTranslations } from 'next-intl/server'
import { getTodayString, toDateString, WEEKDAYS } from '@/lib/date'
import { prisma } from '@/lib/db'
import { getEffectiveMembershipStatus, isMembershipActive } from '@/lib/membership'
import { requireMember } from '@/lib/admin'
import { Role } from '@prisma/client'
import type { MembershipStatus, MembershipType } from '@prisma/client'

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

export async function getCurrentMember(locale: string): Promise<CurrentMember> {
	const userId = await requireMember()

	const [user, tActions, tWeekdays, tMembership] = await Promise.all([
		prisma.user.findUnique({
			where: { id: userId },
			include: {
				visits: { orderBy: [{ date: 'desc' }, { time: 'desc' }], take: 50 },
				classBookings: {
					where: { date: { gte: getTodayString() } },
					include: { gymClass: true },
					orderBy: [{ date: 'asc' }, { time: 'asc' }]
				}
			}
		}),
		getTranslations({ locale, namespace: 'Actions.classBookings' }),
		getTranslations({ locale, namespace: 'Weekdays' }),
		getTranslations({ locale, namespace: 'MembershipMeta' })
	])
	if (!user) throw new Error(tActions('memberNotFound'))

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
		return { day: tWeekdays(day), count }
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
		membershipType: user.membershipType
			? tMembership(`types.${user.membershipType}`)
			: tMembership('types.none'),
		membershipTypeKey: user.membershipType,
		membershipStatus: tMembership(`statuses.${membershipStatus}`),
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

export async function getMembers(locale: string): Promise<Member[]> {
	const [users, tMembership] = await Promise.all([
		prisma.user.findMany({
			where: { role: Role.MEMBER },
			orderBy: [{ name: 'asc' }, { username: 'asc' }],
			include: {
				visits: { orderBy: [{ date: 'desc' }, { time: 'desc' }] }
			}
		}),
		getTranslations({ locale, namespace: 'MembershipMeta' })
	])
	return users.map((u) => {
		const membershipStatus = getEffectiveMembershipStatus(u.membershipStatus, u.expiryDate)

		return {
			id: u.id,
			name: u.name,
			username: u.username,
			membershipType: u.membershipType
				? tMembership(`types.${u.membershipType}`)
				: tMembership('types.none'),
			membershipTypeKey: u.membershipType,
			membershipStatus: tMembership(`statuses.${membershipStatus}`),
			membershipStatusKey: membershipStatus,
			isActive: isMembershipActive(u.membershipStatus, u.expiryDate),
			startDate: u.startDate,
			expiryDate: u.expiryDate,
			gymVisits: u.gymVisits,
			visitHistory: u.visits.map((v) => ({ date: v.date, time: v.time }))
		}
	})
}
