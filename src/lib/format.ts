import { MembershipStatus, MembershipType } from '@prisma/client'

import { getMembershipStatusLabel, getMembershipTypeLabel } from '@/lib/membership'

export function formatMembershipType(type: MembershipType | null | undefined): string {
	return getMembershipTypeLabel(type)
}

export function formatMembershipStatus(status: MembershipStatus): string {
	return getMembershipStatusLabel(status)
}
