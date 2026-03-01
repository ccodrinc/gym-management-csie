import { hash } from 'bcryptjs'
import { MembershipType, PrismaClient, Role } from '@prisma/client'

import { getTodayString } from '../src/lib/date'

const prisma = new PrismaClient()

async function main() {
	// Admin user (hardcoded for seed)
	const adminUsername = 'admin'
	const adminPassword = 'Admin123!'
	const adminPasswordHash = await hash(adminPassword, 12)

	const admin = await prisma.user.upsert({
		where: { username: adminUsername },
		update: {},
		create: {
			name: 'Administrator',
			username: adminUsername,
			password: adminPasswordHash,
			role: Role.ADMIN
		}
	})
	console.log('Admin:', admin.username)

	// Member users (alexandrupopescu has password for demo login)
	const memberPasswordHash = await hash('Member123!', 12)
	const members = [
		{
			username: 'alexandrupopescu',
			name: 'Alexandru Popescu',
			phone: '+40 721 123 456',
			membershipType: MembershipType.Monthly,
			startDate: '2025-01-15',
			expiryDate: '2025-02-15',
			gymVisits: 24,
			hasPassword: true
		},
		{
			username: 'stefanmarin',
			name: 'Stefan Marin',
			membershipType: MembershipType.Annual,
			startDate: '2024-03-01',
			expiryDate: '2025-03-01',
			gymVisits: 156,
			hasPassword: false
		},
		{
			username: 'andreitanase',
			name: 'Andrei Tanase',
			membershipType: MembershipType.Day_Pass,
			startDate: '2025-02-20',
			expiryDate: '2025-02-20',
			gymVisits: 1,
			hasPassword: false
		},
		{
			username: 'mariaionescu',
			name: 'Maria Ionescu',
			membershipType: MembershipType.Monthly,
			startDate: '2025-02-01',
			expiryDate: '2025-03-01',
			gymVisits: 12,
			hasPassword: false
		},
		{
			username: 'catalinradu',
			name: 'Catalin Radu',
			membershipType: MembershipType.Annual,
			startDate: '2023-06-15',
			expiryDate: '2024-06-15',
			gymVisits: 89,
			hasPassword: false
		},
		{
			username: 'raducojocaru',
			name: 'Radu Cojocaru',
			membershipType: MembershipType.Monthly,
			startDate: '2025-01-20',
			expiryDate: '2025-02-20',
			gymVisits: 18,
			hasPassword: false
		}
	]

	const userIds: Record<string, string> = {}
	for (const m of members) {
		const user = await prisma.user.upsert({
			where: { username: m.username },
			update: {
				name: m.name,
				phone: m.phone ?? undefined,
				membershipType: m.membershipType,
				startDate: m.startDate,
				expiryDate: m.expiryDate,
				gymVisits: m.gymVisits,
				password: m.hasPassword ? memberPasswordHash : null
			},
			create: {
				username: m.username,
				name: m.name,
				phone: m.phone ?? undefined,
				membershipType: m.membershipType,
				startDate: m.startDate,
				expiryDate: m.expiryDate,
				gymVisits: m.gymVisits,
				password: m.hasPassword ? memberPasswordHash : null,
				role: Role.MEMBER
			}
		})
		userIds[m.username] = user.id
	}
	console.log('Members:', Object.keys(userIds).length)

	// Visits for alexandrupopescu (and others for check-ins)
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
		// Today's check-ins
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
	console.log('Visits:', visitData.length)

	// Gym classes
	await prisma.classBooking.deleteMany({})
	await prisma.gymClass.deleteMany({})
	const classes = [
		{ name: 'HIIT', day: 'Mon', time: '08:00', spots: 12, maxSpots: 20 },
		{ name: 'Strength', day: 'Tue', time: '09:30', spots: 5, maxSpots: 16 },
		{ name: 'Mobility', day: 'Wed', time: '18:00', spots: 18, maxSpots: 20 },
		{ name: 'HIIT', day: 'Thu', time: '08:00', spots: 8, maxSpots: 20 },
		{ name: 'Strength', day: 'Fri', time: '17:30', spots: 3, maxSpots: 16 }
	]

	const classIds: string[] = []
	for (const c of classes) {
		const gc = await prisma.gymClass.create({
			data: { name: c.name, day: c.day, time: c.time, spots: c.spots, maxSpots: c.maxSpots }
		})
		classIds.push(gc.id)
	}
	console.log('Classes:', classIds.length)

	// Class bookings for alexandrupopescu
	const demoMemberId = userIds['alexandrupopescu']
	if (demoMemberId) {
		await prisma.classBooking.createMany({
			data: [
				{ userId: demoMemberId, gymClassId: classIds[0], date: '2025-03-01', time: '08:00' },
				{ userId: demoMemberId, gymClassId: classIds[1], date: '2025-03-03', time: '09:30' }
			]
		})
	}

	console.log('Seed completed.')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
