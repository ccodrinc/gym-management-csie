import { MembershipStatus, MembershipType } from '@prisma/client'

import { getTodayString } from '@/lib/date'

type MembershipPlan = {
	type: MembershipType
	queryValue: 'monthly' | 'annual' | 'dayPass'
	title: string
	price: number
	period: string
	description: string
	durationDays: number
	features: string[]
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
	{
		type: MembershipType.Day_Pass,
		queryValue: 'dayPass',
		title: 'Day Pass',
		price: 15,
		period: 'per visit',
		description: 'One-day access to the weights floor, turf zone, and every class on the schedule.',
		durationDays: 1,
		features: ['Single-day access', 'Group class access', 'Open gym access', 'No contract']
	},
	{
		type: MembershipType.Monthly,
		queryValue: 'monthly',
		title: 'Monthly',
		price: 65,
		period: 'per month',
		description: 'Flexible month-to-month access with classes included.',
		durationDays: 30,
		features: ['Unlimited gym access', 'Up to 3 class bookings', 'Locker access', 'Cancel anytime']
	},
	{
		type: MembershipType.Annual,
		queryValue: 'annual',
		title: 'Annual',
		price: 650,
		period: 'per year',
		description: 'Best value for members training year-round.',
		durationDays: 365,
		features: ['Everything in Monthly', 'Priority class access', 'Best effective rate', 'Member perks']
	}
]

export const MEMBERSHIP_PLAN_MAP = Object.fromEntries(
	MEMBERSHIP_PLANS.map((plan) => [plan.type, plan])
) as Record<MembershipType, MembershipPlan>

export const MEMBERSHIP_QUERY_MAP = Object.fromEntries(
	MEMBERSHIP_PLANS.map((plan) => [plan.queryValue, plan.type])
) as Record<MembershipPlan['queryValue'], MembershipType>

export function getMembershipTypeLabel(type: MembershipType | null | undefined): string {
	if (!type) return 'No Plan'
	return MEMBERSHIP_PLAN_MAP[type].title
}

export function getMembershipStatusLabel(status: MembershipStatus): string {
	switch (status) {
		case MembershipStatus.ACTIVE:
			return 'Active'
		case MembershipStatus.EXPIRED:
			return 'Expired'
		default:
			return 'Deactivated'
	}
}

export function getEffectiveMembershipStatus(
	status: MembershipStatus,
	expiryDate: string | null | undefined
): MembershipStatus {
	if (status === MembershipStatus.DEACTIVATED) return status
	if (!expiryDate) return MembershipStatus.EXPIRED
	return expiryDate >= getTodayString()
		? MembershipStatus.ACTIVE
		: MembershipStatus.EXPIRED
}

export function isMembershipActive(
	status: MembershipStatus,
	expiryDate: string | null | undefined
): boolean {
	return getEffectiveMembershipStatus(status, expiryDate) === MembershipStatus.ACTIVE
}

export function getMembershipEndDate(
	type: MembershipType,
	startDate: Date
): string {
	const plan = MEMBERSHIP_PLAN_MAP[type]
	const endDate = new Date(startDate)
	endDate.setDate(startDate.getDate() + plan.durationDays - 1)
	return endDate.toISOString().slice(0, 10)
}

export function getMembershipTypeFromQuery(
	value: string | null | undefined
): MembershipType | null {
	if (!value) return null
	return MEMBERSHIP_QUERY_MAP[value as keyof typeof MEMBERSHIP_QUERY_MAP] ?? null
}
