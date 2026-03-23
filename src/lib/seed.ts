import { compare, hash } from 'bcryptjs'

import { MembershipStatus, MembershipType, Role } from '@/generated/prisma/client'
import { prisma } from '@/lib/db'
import { getTodayString, toDateString } from '@/lib/date'

export async function runSeed(): Promise<void> {
	const today = new Date()
	const shiftDate = (days: number) => {
		const nextDate = new Date(today)
		nextDate.setDate(today.getDate() + days)
		return toDateString(nextDate)
	}

	const adminUsername = 'admin'
	const adminPassword = 'Admin123!'
	const adminPasswordHash = await hash(adminPassword, 12)

	await prisma.user.upsert({
		where: { username: adminUsername },
		update: { password: adminPasswordHash, phone: '+40 (770) 758 944' },
		create: {
			name: 'Administrator',
			username: adminUsername,
			password: adminPasswordHash,
			phone: '+40 (770) 758 944',
			role: Role.ADMIN
		}
	})

	const admin = await prisma.user.findUnique({ where: { username: adminUsername } })
	const adminPasswordOk = admin?.password && (await compare(adminPassword, admin.password))
	if (!adminPasswordOk) throw new Error('Admin password verification failed after seed')

	await prisma.user.deleteMany({
		where: { role: Role.MEMBER }
	})

	const memberPasswordHash = await hash('Member123!', 12)
	const members = [
		{
			username: 'alexandrupopescu',
			name: 'Alexandru Popescu',
			phone: '+40 721 123 456',
			membershipType: MembershipType.Monthly,
			membershipStatus: MembershipStatus.ACTIVE,
			startDate: shiftDate(-10),
			expiryDate: shiftDate(20),
			gymVisits: 24
		},
		{
			username: 'stefanmarin',
			name: 'Stefan Marin',
			membershipType: MembershipType.Annual,
			membershipStatus: MembershipStatus.ACTIVE,
			startDate: shiftDate(-90),
			expiryDate: shiftDate(275),
			gymVisits: 156
		},
		{
			username: 'andreitanase',
			name: 'Andrei Tanase',
			membershipType: null,
			membershipStatus: MembershipStatus.DEACTIVATED,
			startDate: null,
			expiryDate: null,
			gymVisits: 1
		},
		{
			username: 'mariaionescu',
			name: 'Maria Ionescu',
			membershipType: MembershipType.Monthly,
			membershipStatus: MembershipStatus.ACTIVE,
			startDate: shiftDate(-5),
			expiryDate: shiftDate(25),
			gymVisits: 12
		},
		{
			username: 'catalinradu',
			name: 'Catalin Radu',
			membershipType: MembershipType.Annual,
			membershipStatus: MembershipStatus.EXPIRED,
			startDate: shiftDate(-420),
			expiryDate: shiftDate(-55),
			gymVisits: 89
		},
		{
			username: 'raducojocaru',
			name: 'Radu Cojocaru',
			membershipType: MembershipType.Monthly,
			membershipStatus: MembershipStatus.EXPIRED,
			startDate: shiftDate(-45),
			expiryDate: shiftDate(-15),
			gymVisits: 18
		}
	]

	const userIds: Record<string, string> = {}
	for (const m of members) {
		const user = await prisma.user.create({
			data: {
				username: m.username,
				name: m.name,
				phone: m.phone ?? undefined,
				membershipType: m.membershipType,
				membershipStatus: m.membershipStatus,
				startDate: m.startDate,
				expiryDate: m.expiryDate,
				gymVisits: m.gymVisits,
				password: memberPasswordHash,
				role: Role.MEMBER
			}
		})
		userIds[m.username] = user.id
	}

	const visitData = [
		{ username: 'alexandrupopescu', date: '2025-02-28', time: '07:15' },
		{ username: 'alexandrupopescu', date: '2025-02-26', time: '18:30' },
		{ username: 'alexandrupopescu', date: '2025-02-24', time: '09:00' },
		{ username: 'alexandrupopescu', date: '2025-02-22', time: '12:45' },
		{ username: 'alexandrupopescu', date: '2025-02-20', time: '17:00' },
		{ username: 'alexandrupopescu', date: '2025-02-18', time: '08:15' },
		{ username: 'alexandrupopescu', date: '2025-02-15', time: '17:30' },
		{ username: 'alexandrupopescu', date: '2025-02-13', time: '12:00' },
		{ username: 'alexandrupopescu', date: '2025-02-10', time: '09:00' },
		{ username: 'alexandrupopescu', date: '2025-02-08', time: '18:00' },
		{ username: 'alexandrupopescu', date: '2025-02-05', time: '07:30' },
		{ username: 'alexandrupopescu', date: '2025-02-03', time: '14:00' },
		{ username: 'alexandrupopescu', date: '2025-02-01', time: '11:00' },
		{ username: 'alexandrupopescu', date: '2025-01-28', time: '17:15' },
		{ username: 'alexandrupopescu', date: '2025-01-25', time: '08:45' },
		{ username: 'alexandrupopescu', date: getTodayString(), time: '07:15' },
		{ username: 'stefanmarin', date: getTodayString(), time: '07:22' },
		{ username: 'mariaionescu', date: getTodayString(), time: '08:05' },
		{ username: 'raducojocaru', date: getTodayString(), time: '09:30' },
		{ username: 'alexandrupopescu', date: getTodayString(), time: '12:45' },
		{ username: 'andreitanase', date: getTodayString(), time: '17:00' }
	]

	await prisma.visit.deleteMany({})
	for (const v of visitData) {
		const userId = userIds[v.username]
		if (userId) {
			await prisma.visit.create({
				data: { userId, date: v.date, time: v.time }
			})
		}
	}

	await prisma.classBooking.deleteMany({})
	await prisma.gymClass.deleteMany({})
	const classes = [
		{ name: 'HIIT', day: 'Mon', time: '08:00', maxSpots: 20 },
		{ name: 'Strength', day: 'Tue', time: '09:30', maxSpots: 16 },
		{ name: 'Mobility', day: 'Wed', time: '18:00', maxSpots: 20 },
		{ name: 'HIIT', day: 'Thu', time: '08:00', maxSpots: 20 },
		{ name: 'Strength', day: 'Fri', time: '17:30', maxSpots: 16 }
	]

	const classIds: string[] = []
	for (const c of classes) {
		const gc = await prisma.gymClass.create({
			data: { name: c.name, day: c.day, time: c.time, maxSpots: c.maxSpots }
		})
		classIds.push(gc.id)
	}

	const demoMemberId = userIds['alexandrupopescu']
	if (demoMemberId) {
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		const dayAfterTomorrow = new Date()
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

		await prisma.classBooking.createMany({
			data: [
				{ userId: demoMemberId, gymClassId: classIds[0], date: toDateString(tomorrow), time: '08:00' },
				{ userId: demoMemberId, gymClassId: classIds[1], date: toDateString(dayAfterTomorrow), time: '09:30' }
			]
		})
	}
}
