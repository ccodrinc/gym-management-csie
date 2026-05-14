import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { Role } from '@/generated/prisma/client'
import { routing } from '@/i18n/routing'
import { prisma } from '@/lib/db'

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

export async function requireClassManager(gymClassId: string): Promise<{ userId: string; role: Role }> {
	const session = await auth()
	if (!session?.user) {
		throw new Error('Unauthorized')
	}

	if (session.user.role === Role.ADMIN) {
		return { userId: session.user.id, role: session.user.role }
	}

	if (session.user.role !== Role.TRAINER) {
		throw new Error('Unauthorized')
	}

	const gymClass = await prisma.gymClass.findUnique({
		where: { id: gymClassId },
		select: { trainerId: true }
	})

	if (!gymClass || gymClass.trainerId !== session.user.id) {
		throw new Error('Unauthorized')
	}

	return { userId: session.user.id, role: session.user.role }
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
	revalidateAppPaths(['/admin/classes', '/trainer/classes', '/trainer', '/member/classes', '/member'])
}
