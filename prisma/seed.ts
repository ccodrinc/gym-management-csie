import { runSeed } from '../src/lib/seed'

runSeed()
	.then(() => {
		console.log('Seed completed.')
	})
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
