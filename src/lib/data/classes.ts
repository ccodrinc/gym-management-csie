import { MOCK_CLASSES } from '../mock-data'

export type GymClass = (typeof MOCK_CLASSES)[number]

export async function getClasses(): Promise<GymClass[]> {
	// TODO: Replace with API/DB call
	return MOCK_CLASSES
}
