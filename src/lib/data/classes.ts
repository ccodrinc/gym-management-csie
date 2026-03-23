import { prisma } from '@/lib/db'
import { getTodayString, getNextOccurrenceString, WEEKDAYS } from '@/lib/date'

export type GymClass = {
	id: string
	name: string
	day: string
	time: string
	maxSpots: number
	nextSessionDate: string
	nextSessionBookings: number
	totalUpcomingBookings: number
}

export type ClassBookingWithUser = {
	id: string
	userId: string
	gymClassId: string
	userName: string | null
	username: string
	date: string
	time: string
}

export type ClassWithBookings = GymClass & {
	bookings: ClassBookingWithUser[]
}

export async function getClasses(): Promise<GymClass[]> {
	const today = getTodayString()
	const classes = await prisma.gymClass.findMany({
		include: {
			bookings: {
				where: { date: { gte: today } },
				select: { id: true, userId: true, date: true }
			}
		}
	})
	return classes
		.map((c) => {
			const nextSessionDate = getNextOccurrenceString(c.day as (typeof WEEKDAYS)[number])
			return {
				id: c.id,
				name: c.name,
				day: c.day,
				time: c.time,
				maxSpots: c.maxSpots,
				nextSessionDate,
				nextSessionBookings: c.bookings.filter((booking) => booking.date === nextSessionDate).length,
				totalUpcomingBookings: c.bookings.length
			}
		})
		.sort((a, b) => {
			const dayDiff =
				WEEKDAYS.indexOf(a.day as (typeof WEEKDAYS)[number]) - WEEKDAYS.indexOf(b.day as (typeof WEEKDAYS)[number])
			return dayDiff !== 0 ? dayDiff : a.time.localeCompare(b.time)
		})
}

export async function getClassWithBookings(gymClassId: string): Promise<ClassWithBookings | null> {
	const today = getTodayString()
	const gymClass = await prisma.gymClass.findUnique({
		where: { id: gymClassId },
		include: {
			bookings: {
				where: { date: { gte: today } },
				include: { user: true },
				orderBy: [{ date: 'asc' }, { time: 'asc' }]
			}
		}
	})
	if (!gymClass) return null
	const nextSessionDate = getNextOccurrenceString(gymClass.day as (typeof WEEKDAYS)[number])
	return {
		id: gymClass.id,
		name: gymClass.name,
		day: gymClass.day,
		time: gymClass.time,
		maxSpots: gymClass.maxSpots,
		nextSessionDate,
		nextSessionBookings: gymClass.bookings.filter((booking) => booking.date === nextSessionDate).length,
		totalUpcomingBookings: gymClass.bookings.length,
		bookings: gymClass.bookings.map((b) => ({
			id: b.id,
			userId: b.userId,
			gymClassId: b.gymClassId,
			userName: b.user.name,
			username: b.user.username,
			date: b.date,
			time: b.time
		}))
	}
}
