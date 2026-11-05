// Runs the generator's checks under Node.
//
// There is no test runner in this project, and the generator's risky parts are
// pure maths rather than components, so this bundles them with esbuild and
// asserts against the measurements taken from the real competition renders.
//
//   npm run check:cardgen
//
// The bundler stands in for Vite: it resolves the `~` alias and the `?raw`
// imports the marks use, neither of which Node understands on its own.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const out = path.join(root, 'node_modules/.cache/cardgen-check.mjs')

await build({
  entryPoints: [path.join(here, 'cardgen-check.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: out,
  logLevel: 'error',
  // Plain `~/...` specifiers go through esbuild's own resolution, so it still
  // supplies the file extension. The plugin below only handles `?raw`, which
  // esbuild has no concept of.
  alias: { '~': path.join(root, 'app') },
  plugins: [{
    name: 'vite-ish',
    setup(b) {
      b.onResolve({ filter: /\?raw$/ }, args => {
        const bare = args.path.replace(/\?raw$/, '')
        return {
          path: bare.startsWith('~/')
            ? path.join(root, 'app', bare.slice(2))
            : path.resolve(args.resolveDir, bare),
          namespace: 'raw',
        }
      })
      b.onLoad({ filter: /.*/, namespace: 'raw' }, async args => ({
        contents: await readFile(args.path, 'utf8'),
        loader: 'text',
      }))
    },
  }],
})

await import(out)
