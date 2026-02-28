import { MOCK_CURRENT_MEMBER, MOCK_USERS, type MembershipType } from '../mock-data'

export type Member = (typeof MOCK_USERS)[number]
export type CurrentMember = typeof MOCK_CURRENT_MEMBER

export async function getCurrentMember(): Promise<CurrentMember> {
	// TODO: Replace with API/DB call, use session
	return MOCK_CURRENT_MEMBER
}

export async function getMembers(): Promise<Member[]> {
	// TODO: Replace with API/DB call
	return MOCK_USERS
}

export type { MembershipType }
