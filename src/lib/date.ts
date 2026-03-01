/** Returns today's date as YYYY-MM-DD */
export function getTodayString(): string {
	return new Date().toISOString().slice(0, 10)
}

/** Returns date as YYYY-MM-DD for a given Date */
export function toDateString(date: Date): string {
	return date.toISOString().slice(0, 10)
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
