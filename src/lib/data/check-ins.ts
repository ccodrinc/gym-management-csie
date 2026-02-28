import { MOCK_CHECK_INS, MOCK_PEAK_HOURS } from '../mock-data'

export type CheckIn = (typeof MOCK_CHECK_INS)[number]
export type PeakHour = (typeof MOCK_PEAK_HOURS)[number]

export async function getCheckIns(): Promise<CheckIn[]> {
	// TODO: Replace with API/DB call
	return MOCK_CHECK_INS
}

export async function getPeakHours(): Promise<PeakHour[]> {
	// TODO: Replace with API/DB call
	return MOCK_PEAK_HOURS
}
