import { prisma } from '@/lib/db'

export type GymClass = {
	id: string
	name: string
	day: string
	time: string
	spots: number
	maxSpots: number
}

export type ClassBookingWithUser = {
	id: string
	userId: string
	userName: string | null
	username: string
	date: string
	time: string
}

export type ClassWithBookings = GymClass & {
	bookings: ClassBookingWithUser[]
}

export async function getClasses(): Promise<GymClass[]> {
	const classes = await prisma.gymClass.findMany({ orderBy: [{ day: 'asc' }, { time: 'asc' }] })
	return classes.map((c) => ({
		id: c.id,
		name: c.name,
		day: c.day,
		time: c.time,
		spots: c.spots,
		maxSpots: c.maxSpots
	}))
}

export async function getClassWithBookings(gymClassId: string): Promise<ClassWithBookings | null> {
	const gymClass = await prisma.gymClass.findUnique({
		where: { id: gymClassId },
		include: {
			bookings: {
				include: { user: true },
				orderBy: [{ date: 'asc' }, { time: 'asc' }]
			}
		}
	})
	if (!gymClass) return null
	return {
		id: gymClass.id,
		name: gymClass.name,
		day: gymClass.day,
		time: gymClass.time,
		spots: gymClass.spots,
		maxSpots: gymClass.maxSpots,
		bookings: gymClass.bookings.map((b) => ({
			id: b.id,
			userId: b.userId,
			userName: b.user.name,
			username: b.user.username,
			date: b.date,
			time: b.time
		}))
	}
}
