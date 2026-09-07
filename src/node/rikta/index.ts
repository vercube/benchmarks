import 'reflect-metadata'
import { createReadStream } from 'node:fs'
import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Res,
	Rikta,
	type FastifyReply
} from '@riktajs/core'
import { extraRoutes } from '../../extra-routes.mjs'

@Controller()
class AppController {
	@Get('/')
	ping() {
		return 'Hi'
	}

	@Get('/video')
	video(@Res() reply: FastifyReply) {
		reply.type('video/mp4')

		return createReadStream('public/kyuukurarin.mp4')
	}

	@Get('/id/:id')
	query(
		@Param('id') id: string,
		@Query('name') name: string,
		@Res() reply: FastifyReply
	) {
		reply.header('x-powered-by', 'benchmark')

		return `${id} ${name}`
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
			value: () => 'ok'
		})
		method(path)(
			AppController.prototype,
			name,
			Object.getOwnPropertyDescriptor(AppController.prototype, name)!
		)
	}
}

const app = await Rikta.create({
	host: '127.0.0.1',
	port: 3000,
	logger: false,
	silent: true,
	autowired: false,
	controllers: [AppController]
})

await app.listen()
