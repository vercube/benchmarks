import type * as Vercube from '@vercube/core'
import { extraRoutes } from './extra-routes.mjs'

const queryHeaders = {
	'content-type': 'text/plain',
	'x-powered-by': 'benchmark'
}

export const startVercube = async (
	{
		Body,
		Controller,
		createApp,
		FastResponse,
		Get,
		Param,
		Post,
		QueryParam
	}: typeof Vercube,
	runtime: 'bun' | 'node' | 'deno',
	createVideo: () => Response | Promise<Response>
) => {
	@Controller('/')
	class AppController {
		@Get('/')
		ping() {
			return new FastResponse('Hi', { headers: queryHeaders })
		}

		@Get('/video')
		video() {
			return createVideo()
		}

		@Get('/id/:id')
		query(
			@Param('id') id: string,
			@QueryParam({ name: 'name' }) name: string | null
		) {
			return new FastResponse(`${id} ${name ?? ''}`, {
				headers: queryHeaders
			})
		}

		@Post('/json')
		json(@Body() body: unknown) {
			return body
		}
	}

	for (const [index, route] of extraRoutes.entries()) {
		for (const [method, path, prefix] of [
			[Get, route, 'extraGet'],
			[Post, `${route}/submit`, 'extraPost']
		] as const) {
			const name = `${prefix}${index}`
			Object.defineProperty(AppController.prototype, name, {
				configurable: true,
				value: () => new FastResponse('ok')
			})
			method(path)(
				AppController.prototype,
				name,
				Object.getOwnPropertyDescriptor(AppController.prototype, name)!
			)
		}
	}

	const app = await createApp({
		cfg: {
			logLevel: 'error',
			production: true,
			dev: false,
			requestLogging: false,
			requestContext: false,
			c12: { dotenv: false },
			server: {
				runtime,
				host: '127.0.0.1',
				port: 3000,
				static: { dirs: [] }
			}
		},
		setup: (app) => {
			app.container.bind(AppController)
		}
	})

	await app.listen()
}
