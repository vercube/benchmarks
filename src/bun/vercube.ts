import * as core from '@vercube/core'
import { startVercube } from '../vercube-app'

await startVercube(core, 'bun', () =>
	new Response(Bun.file('public/kyuukurarin.mp4').stream(), {
		headers: { 'content-type': 'video/mp4' }
	})
)
