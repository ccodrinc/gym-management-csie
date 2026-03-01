import { prisma } from '@/lib/db'
import { getTodayString } from '@/lib/date'

export type CheckIn = {
	id: string
	memberName: string
	time: string
}

export async function getCheckIns(): Promise<CheckIn[]> {
	const today = getTodayString()
	const visits = await prisma.visit.findMany({
		where: { date: today },
		include: { user: true }
	})
	return visits.map((v) => ({
		id: v.id,
		memberName: v.user.name ?? v.user.username,
		time: v.time
	}))
}
