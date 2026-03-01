/** Map Prisma MembershipType enum to display string */
export function formatMembershipType(t: string | null | undefined): string {
	if (!t) return '—'
	return t === 'Day_Pass' ? 'Day Pass' : t
}
