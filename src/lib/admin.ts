import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { routing } from '@/i18n/routing'

async function requireRole(role: Role): Promise<string> {
	const session = await auth()
	if (!session?.user || session.user.role !== role) {
		throw new Error('Unauthorized')
	}

	return session.user.id
}

export async function requireAdmin(): Promise<void> {
	await requireRole(Role.ADMIN)
}

export async function requireMember(): Promise<string> {
	return requireRole(Role.MEMBER)
}

export function revalidateAppPaths(paths: string[]): void {
	const revalidationTargets = new Set<string>()

	for (const path of paths) {
		revalidationTargets.add(path)

		for (const locale of routing.locales) {
			revalidationTargets.add(path === '/' ? `/${locale}` : `/${locale}${path}`)
		}
	}

	for (const path of revalidationTargets) {
		revalidatePath(path)
	}
}

export function revalidateClassesPath(): void {
	revalidateAppPaths(['/admin/classes', '/member/classes', '/member'])
}
