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

export const MOCK_CURRENT_MEMBER = {
	id: '1',
	name: 'Alex Johnson',
	email: 'alex.johnson@example.com',
	phone: '+1 555-0123',
	membershipType: 'Monthly' as const,
	isActive: true,
	startDate: '2025-01-15',
	expiryDate: '2025-02-15',
	gymVisits: 24,
	recentVisits: [
		{ date: '2025-02-28', time: '07:15' },
		{ date: '2025-02-26', time: '18:30' },
		{ date: '2025-02-24', time: '09:00' },
		{ date: '2025-02-22', time: '12:45' },
		{ date: '2025-02-20', time: '17:00' }
	],
	visitHistory: [
		{ date: '2025-02-28', time: '07:15' },
		{ date: '2025-02-26', time: '18:30' },
		{ date: '2025-02-24', time: '09:00' },
		{ date: '2025-02-22', time: '12:45' },
		{ date: '2025-02-20', time: '17:00' },
		{ date: '2025-02-18', time: '08:15' },
		{ date: '2025-02-15', time: '17:30' },
		{ date: '2025-02-13', time: '12:00' },
		{ date: '2025-02-10', time: '09:00' },
		{ date: '2025-02-08', time: '18:00' },
		{ date: '2025-02-05', time: '07:30' },
		{ date: '2025-02-03', time: '14:00' },
		{ date: '2025-02-01', time: '11:00' },
		{ date: '2025-01-28', time: '17:15' },
		{ date: '2025-01-25', time: '08:45' }
	],
	visitsLast7Days: [
		{ day: 'Mon', count: 0 },
		{ day: 'Tue', count: 0 },
		{ day: 'Wed', count: 1 },
		{ day: 'Thu', count: 0 },
		{ day: 'Fri', count: 1 },
		{ day: 'Sat', count: 1 },
		{ day: 'Sun', count: 1 }
	],
	upcomingClasses: [
		{ name: 'HIIT', date: '2025-03-01', time: '08:00' },
		{ name: 'Strength', date: '2025-03-03', time: '09:30' }
	]
}

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

export const MOCK_CHECK_INS = [
	{ id: '1', memberName: 'Alex Johnson', time: '07:15' },
	{ id: '2', memberName: 'Sam Chen', time: '07:22' },
	{ id: '3', memberName: 'Morgan Lee', time: '08:05' },
	{ id: '4', memberName: 'Riley Kim', time: '09:30' },
	{ id: '5', memberName: 'Alex Johnson', time: '12:45' },
	{ id: '6', memberName: 'Jordan Taylor', time: '17:00' }
]

export const MOCK_PEAK_HOURS = [
	{ hour: '6am', checkIns: 12 },
	{ hour: '7am', checkIns: 34 },
	{ hour: '8am', checkIns: 28 },
	{ hour: '9am', checkIns: 18 },
	{ hour: '12pm', checkIns: 45 },
	{ hour: '5pm', checkIns: 52 },
	{ hour: '6pm', checkIns: 38 }
]

export const MOCK_CLASSES = [
	{ id: '1', name: 'HIIT', day: 'Mon', time: '08:00', spots: 12, maxSpots: 20 },
	{ id: '2', name: 'Strength', day: 'Tue', time: '09:30', spots: 5, maxSpots: 16 },
	{ id: '3', name: 'Mobility', day: 'Wed', time: '18:00', spots: 18, maxSpots: 20 },
	{ id: '4', name: 'HIIT', day: 'Thu', time: '08:00', spots: 8, maxSpots: 20 },
	{ id: '5', name: 'Strength', day: 'Fri', time: '17:30', spots: 3, maxSpots: 16 }
]
