export const MOCK_ANALYTICS = {
	totalMembers: 1247,
	activeToday: 89,
	newThisMonth: 42,
	avgCheckinsPerDay: 156,
	visitsPerDay: [
		{ day: 'Mon', visits: 142 },
		{ day: 'Tue', visits: 178 },
		{ day: 'Wed', visits: 165 },
		{ day: 'Thu', visits: 189 },
		{ day: 'Fri', visits: 201 },
		{ day: 'Sat', visits: 134 },
		{ day: 'Sun', visits: 98 }
	],
	membershipBreakdown: [
		{ type: 'Monthly', count: 612 },
		{ type: 'Annual', count: 398 },
		{ type: 'Day Pass', count: 237 }
	]
}

export type MembershipType = 'Monthly' | 'Annual' | 'Day Pass'

export const MOCK_USERS = [
	{
		id: '1',
		name: 'Alex Johnson',
		email: 'alex.johnson@example.com',
		membershipType: 'Monthly' as const,
		isActive: true,
		startDate: '2025-01-15',
		expiryDate: '2025-02-15',
		gymVisits: 24
	},
	{
		id: '2',
		name: 'Sam Chen',
		email: 'sam.chen@example.com',
		membershipType: 'Annual' as const,
		isActive: true,
		startDate: '2024-03-01',
		expiryDate: '2025-03-01',
		gymVisits: 156
	},
	{
		id: '3',
		name: 'Jordan Taylor',
		email: 'jordan.taylor@example.com',
		membershipType: 'Day Pass' as const,
		isActive: false,
		startDate: '2025-02-20',
		expiryDate: '2025-02-20',
		gymVisits: 1
	},
	{
		id: '4',
		name: 'Morgan Lee',
		email: 'morgan.lee@example.com',
		membershipType: 'Monthly' as const,
		isActive: true,
		startDate: '2025-02-01',
		expiryDate: '2025-03-01',
		gymVisits: 12
	},
	{
		id: '5',
		name: 'Casey Rivera',
		email: 'casey.rivera@example.com',
		membershipType: 'Annual' as const,
		isActive: false,
		startDate: '2023-06-15',
		expiryDate: '2024-06-15',
		gymVisits: 89
	},
	{
		id: '6',
		name: 'Riley Kim',
		email: 'riley.kim@example.com',
		membershipType: 'Monthly' as const,
		isActive: true,
		startDate: '2025-01-20',
		expiryDate: '2025-02-20',
		gymVisits: 18
	}
]
