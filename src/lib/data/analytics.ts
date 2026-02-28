import { MOCK_ANALYTICS } from '../mock-data'

export type Analytics = typeof MOCK_ANALYTICS

export async function getAnalytics(): Promise<Analytics> {
	// TODO: Replace with API/DB call
	return MOCK_ANALYTICS
}
