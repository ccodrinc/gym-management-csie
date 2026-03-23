'use server'

import { getTranslations } from 'next-intl/server'

import { Role } from '@/generated/prisma/client'
import { auth } from '@/auth'
import { runSeed } from '@/lib/seed'

export type SeedResult = { ok: true } | { ok: false; error: string }

export async function seedDatabaseAction(): Promise<SeedResult> {
	const tCommon = await getTranslations('Actions.common')
	const session = await auth()
	if (!session?.user || session.user.role !== Role.ADMIN) {
		return { ok: false, error: tCommon('unauthorized') }
	}
	try {
		await runSeed()
		return { ok: true }
	} catch (err) {
		const message = err instanceof Error ? err.message : tCommon('seedFailed')
		return { ok: false, error: message }
	}
}
