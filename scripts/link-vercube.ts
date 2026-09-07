/**
 * Point @vercube/* at a local monorepo checkout, so a run can measure changes
 * that are not published yet. Without this the benchmark measures the versions
 * in package.json, which is what a published result should be.
 *
 *   bun run link:vercube ../vercube          # link
 *   bun run link:vercube --restore           # back to the npm versions
 *
 * The path may also come from VERCUBE_PATH. It must be the repository root, the
 * one containing packages/core.
 */
import { existsSync, lstatSync, readlinkSync, rmSync, symlinkSync } from 'node:fs'
import { resolve } from 'node:path'

const packages = ['core', 'di', 'logger'] as const
const linkedInto = (name: string) => `node_modules/@vercube/${name}`

const restore = async () => {
	for (const name of packages) {
		const target = linkedInto(name)
		if (existsSync(target) && lstatSync(target).isSymbolicLink())
			rmSync(target)
	}

	const install = Bun.spawn({
		cmd: ['bun', 'install'],
		stdout: 'inherit',
		stderr: 'inherit'
	})
	if ((await install.exited) !== 0)
		throw new Error('bun install failed while restoring the npm versions')

	console.log('@vercube/* restored to the versions in package.json')
}

const link = (root: string) => {
	if (!existsSync(`${root}/packages/core`))
		throw new Error(`${root} does not look like a Vercube checkout: no packages/core`)

	for (const name of packages) {
		const source = `${root}/packages/${name}`
		if (!existsSync(source)) throw new Error(`missing ${source}`)

		const target = linkedInto(name)
		if (existsSync(target) || lstatSync(target, { throwIfNoEntry: false }))
			rmSync(target, { recursive: true, force: true })

		symlinkSync(source, target, 'dir')
		console.log(`@vercube/${name} -> ${readlinkSync(target)}`)
	}

	console.log(
		'\nLinked. The packages must be built (pnpm build in the monorepo) for a run to see them.'
	)
}

const [argument] = Bun.argv.slice(2)

if (argument === '--restore') await restore()
else {
	const root = argument ?? Bun.env.VERCUBE_PATH
	if (!root)
		throw new Error(
			'Usage: bun run link:vercube <path-to-vercube-repo> | --restore'
		)

	link(resolve(root))
}
