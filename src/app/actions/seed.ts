'use server'

import { Role } from '@prisma/client'
import { auth } from '@/auth'
import { runSeed } from '@/lib/seed'

export type SeedResult = { ok: true } | { ok: false; error: string }

export async function seedDatabaseAction(): Promise<SeedResult> {
	const session = await auth()
	if (!session?.user || session.user.role !== Role.ADMIN) {
		return { ok: false, error: 'Unauthorized' }
	}
	try {
		await runSeed()
		return { ok: true }
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Seed failed'
		return { ok: false, error: message }
	}
}
