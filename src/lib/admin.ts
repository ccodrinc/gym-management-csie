import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

export async function requireAdmin(): Promise<void> {
	const session = await auth()
	if (!session?.user || session.user.role !== Role.ADMIN) {
		throw new Error('Unauthorized')
	}
}

export async function requireMember(): Promise<string> {
	const session = await auth()
	if (!session?.user || session.user.role !== Role.MEMBER) {
		throw new Error('Unauthorized')
	}

	return session.user.id
}

export function revalidateAppPaths(paths: string[]): void {
	for (const path of paths) {
		revalidatePath(path)
		revalidatePath(`/en${path}`)
	}
}

export function revalidateClassesPath(): void {
	revalidateAppPaths(['/admin/classes', '/member/classes', '/member'])
}
