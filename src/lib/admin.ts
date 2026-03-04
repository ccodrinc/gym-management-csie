import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

export async function requireAdmin(): Promise<void> {
	const session = await auth()
	if (!session?.user || session.user.role !== Role.ADMIN) {
		throw new Error('Unauthorized')
	}
}

export function revalidateClassesPath(): void {
	revalidatePath('/admin/classes')
	revalidatePath('/[locale]/admin/classes')
}
