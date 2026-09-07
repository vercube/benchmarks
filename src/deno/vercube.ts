import * as core from '@vercube/core'
import { startVercube } from '../vercube-app.ts'

await startVercube(
	core,
	'deno',
	async () =>
		new Response((await Deno.open('public/kyuukurarin.mp4')).readable, {
			headers: { 'content-type': 'video/mp4' }
		})
)
