function pad(n: number): string {
	return n.toString().padStart(2, '0')
}

/** Returns a date as YYYY-MM-DD in local time */
export function toDateString(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Returns today's date as YYYY-MM-DD in local time */
export function getTodayString(): string {
	return toDateString(new Date())
}

export function parseStoredDate(dateString: string): Date {
	return new Date(`${dateString}T12:00:00`)
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function getWeekdayIndex(day: (typeof WEEKDAYS)[number]): number {
	return WEEKDAYS.indexOf(day)
}

export function getNextOccurrenceDate(day: (typeof WEEKDAYS)[number], from = new Date()): Date {
	const weekdayIndex = getWeekdayIndex(day)
	if (weekdayIndex < 0) {
		throw new Error(`Unsupported weekday: ${day}`)
	}

	const currentDay = from.getDay()
	const targetDay = weekdayIndex === 6 ? 0 : weekdayIndex + 1
	const daysUntil = (targetDay - currentDay + 7) % 7 || 7
	const nextDate = new Date(from)
	nextDate.setHours(0, 0, 0, 0)
	nextDate.setDate(from.getDate() + daysUntil)
	return nextDate
}

export function getNextOccurrenceString(day: (typeof WEEKDAYS)[number], from = new Date()): string {
	return toDateString(getNextOccurrenceDate(day, from))
}

export function getRecentDateStrings(count: number, from = new Date()) {
	return Array.from({ length: count }, (_, index) => {
		const date = new Date(from)
		date.setDate(from.getDate() - (count - index - 1))
		date.setHours(0, 0, 0, 0)
		return toDateString(date)
	})
}
