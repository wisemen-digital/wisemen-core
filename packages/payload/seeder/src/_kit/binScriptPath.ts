// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/binScriptPath.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import {
  dirname,
  resolve,
} from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The absolute path to one of a plugin's `bin/` scripts, for a `config.bin` entry.
 *
 * The extension has to follow how the package was loaded: the workspace resolves `exports.import`
 * to `src/*.ts` and runs the TS, while a published install runs the transpiled `dist/*.js`. Getting
 * this wrong doesn't fail the build — the bin just isn't there when someone runs the command.
 *
 * `moduleUrl` is the CALLER's `import.meta.url`, and must be: resolving it in here would anchor
 * every lookup to `_kit/bin/`, which doesn't exist. Call it as
 * `binScriptPath(import.meta.url, 'imagesBackfill')` from the plugin that owns the script.
 */
export function binScriptPath(moduleUrl: string, name: string): string {
  const here = fileURLToPath(moduleUrl)
  const ext = here.endsWith('.ts') ? 'ts' : 'mjs'

  return resolve(dirname(here), 'bin', `${name}.${ext}`)
}
