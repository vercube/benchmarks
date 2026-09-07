import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import * as core from '@vercube/core'
import { startVercube } from '../vercube-app'

await startVercube(
	core,
	'node',
	() =>
		new Response(
			Readable.toWeb(
				createReadStream('public/kyuukurarin.mp4')
			) as ReadableStream,
			{ headers: { 'content-type': 'video/mp4' } }
		)
)
