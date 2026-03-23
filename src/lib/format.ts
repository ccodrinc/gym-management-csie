function toDate(value: Date | string) {
	return value instanceof Date ? value : new Date(`${value}T12:00:00`)
}

export function formatDate(
	value: Date | string | null | undefined,
	locale: string,
	options: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}
) {
	if (!value) {
		return '—'
	}

	return new Intl.DateTimeFormat(locale, options).format(toDate(value))
}

export function formatNumber(value: number, locale: string) {
	return new Intl.NumberFormat(locale).format(value)
}

export function formatCurrency(value: number, locale: string, currency = 'USD') {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(value)
}
