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

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
