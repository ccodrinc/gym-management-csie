import { prisma } from '@/lib/db'

export type GymClass = {
	id: string
	name: string
	day: string
	time: string
	spots: number
	maxSpots: number
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
