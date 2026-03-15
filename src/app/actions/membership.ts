'use server'

import { MembershipStatus, MembershipType } from '@prisma/client'

import { requireMember, revalidateAppPaths } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { getMembershipEndDate } from '@/lib/membership'
import { toDateString } from '@/lib/date'

export type PurchaseMembershipResult = { ok: true } | { ok: false; error: string }

export async function purchaseMembershipAction(
	membershipType: MembershipType
): Promise<PurchaseMembershipResult> {
	try {
		const userId = await requireMember()
		const startDate = new Date()

		await prisma.user.update({
			where: { id: userId },
			data: {
				membershipType,
				membershipStatus: MembershipStatus.ACTIVE,
				startDate: toDateString(startDate),
				expiryDate: getMembershipEndDate(membershipType, startDate)
			}
		})

		revalidateAppPaths(['/member', '/member/membership', '/admin/users', '/admin'])
		return { ok: true }
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : 'Failed to activate membership'
		}
	}
}
