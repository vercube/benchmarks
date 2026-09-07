import 'reflect-metadata'
import { createReadStream } from 'node:fs'
import { json, type Response } from 'express'
import {
	Body,
	ContentType,
	Controller,
	Get,
	Header,
	Param,
	Post,
	QueryParam,
	Res,
	UseBefore,
	createExpressServer
} from 'routing-controllers'
import { extraRoutes } from '../../extra-routes.mjs'

@Controller()
class AppController {
	@Get('/')
	@ContentType('text/plain')
	ping() {
		return 'Hi'
	}

	@Get('/video')
	video(@Res() response: Response) {
		response.type('video/mp4')
		// Returning the response makes routing-controllers call next(), which
		// reaches express' final handler. Flush first so it sees headersSent and
		// leaves the stream alone instead of answering 404.
		response.flushHeaders()

		return createReadStream('public/kyuukurarin.mp4').pipe(response)
	}

	@Get('/id/:id')
	@ContentType('text/plain')
	@Header('x-powered-by', 'benchmark')
	query(@Param('id') id: string, @QueryParam('name') name: string) {
		return `${id} ${name}`
	}

	@Post('/json')
	@UseBefore(json())
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
			value: () => 'ok'
		})
		const descriptor = Object.getOwnPropertyDescriptor(
			AppController.prototype,
			name
		)!
		ContentType('text/plain')(AppController.prototype, name, descriptor)
		method(path)(AppController.prototype, name, descriptor)
	}
}

createExpressServer({
	controllers: [AppController],
	classTransformer: false,
	validation: false,
	defaultErrorHandler: false
}).listen(3000)
