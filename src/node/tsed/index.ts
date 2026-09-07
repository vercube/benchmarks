import 'reflect-metadata'
import { createReadStream } from 'node:fs'
import { Configuration, Controller } from '@tsed/di'
import { PlatformExpress } from '@tsed/platform-express'
import { Res } from '@tsed/platform-http'
import { Use } from '@tsed/platform-middlewares'
import { BodyParams, PathParams, QueryParams } from '@tsed/platform-params'
import { Get, Post } from '@tsed/schema'
import { json, type Response } from 'express'
import { extraRoutes } from '../../extra-routes.mjs'

@Controller('/')
class AppController {
	@Get('/')
	ping(@Res() response: Response) {
		response.type('text/plain')

		return 'Hi'
	}

	@Get('/video')
	video(@Res() response: Response) {
		response.type('video/mp4')

		return createReadStream('public/kyuukurarin.mp4')
	}

	@Get('/id/:id')
	query(
		@PathParams('id') id: string,
		@QueryParams('name') name: string,
		@Res() response: Response
	) {
		response.type('text/plain')
		response.setHeader('x-powered-by', 'benchmark')

		return `${id} ${name}`
	}

	@Post('/json')
	@Use(json())
	json(@BodyParams() body: unknown) {
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
			value: () => 'ok'
		})
		const descriptor = Object.getOwnPropertyDescriptor(
			AppController.prototype,
			name
		)!
		method(path)(AppController.prototype, name, descriptor)
	}
}

@Configuration({
	httpPort: '127.0.0.1:3000',
	httpsPort: false,
	logger: { level: 'off' },
	mount: { '/': [AppController] }
})
class Server {}

const platform = await PlatformExpress.bootstrap(Server)
await platform.listen()
