import { existsSync } from 'fs'
import { aot } from 'elysia/plugin/aot/bun'
import { nodeEsm } from '../bench'

const target = Bun.argv[2]
if (!target) throw new Error('Usage: bun scripts/build-framework.ts <runtime/framework>')

if (
	target === 'node/adonis/index' &&
	!existsSync('src/node/adonis/node_modules/@adonisjs/core')
) {
	const install = Bun.spawn({
		cmd: ['bun', 'install', '--cwd', 'src/node/adonis', '--frozen-lockfile'],
		stdout: 'inherit',
		stderr: 'inherit'
	})
	if ((await install.exited) !== 0)
		throw new Error('Adonis dependencies failed to install')
}

let [runtime, framework, index] = target.split('/')
if (runtime !== 'bun' && runtime !== 'node')
	throw new Error(`Bun.build does not support the ${runtime} runtime`)
const isNodeEsm = nodeEsm.has(target)
const isElysiaAot = framework === 'elysia-aot'
if (isElysiaAot) framework = 'elysia'
else if (index) framework += '/index'

const entry = existsSync(`src/${runtime}/${framework}.ts`)
	? `src/${runtime}/${framework}.ts`
	: `src/${runtime}/${framework}.js`
const result = await Bun.build({
	entrypoints: [entry],
	outdir: `dist/${target}`,
	naming: isNodeEsm ? 'index.mjs' : 'index.js',
	target: runtime,
	format: runtime === 'node' && !isNodeEsm ? 'cjs' : 'esm',
	minify: true,
	external: [
		// Only required by routing-controllers' Koa driver, which the Express
		// driver never initialises.
		'@koa/cors',
		'@nestjs/microservices',
		'@nestjs/microservices/*',
		'@nestjs/websockets/*',
		'chokidar',
		'class-transformer',
		'class-validator',
		'phc-argon2',
		'phc-bcrypt',
		'uWebSockets.js'
	],
	plugins: isElysiaAot
		? [aot(entry, { target: runtime as 'bun' | 'node' })]
		: []
})

if (!result.success) {
	result.logs.forEach((log) => console.error(log))
	process.exit(1)
}
