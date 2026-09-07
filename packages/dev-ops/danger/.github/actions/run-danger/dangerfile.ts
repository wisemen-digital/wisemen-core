// Dangerfile wrapper for danger-runner
// Stored in action folder, runs with --dangerfile ${{ github.action_path }}/dangerfile.ts

import * as fs from 'fs'
import * as path from 'path'
import type { DangerDSLType } from 'danger'
import type { DefaultConfig, Rule } from '../../../lib/index.ts'

const cwd = process.cwd()

interface WisemenDangerModule {
  runDangerWithRules: (
    danger: DangerDSLType,
    config: DefaultConfig,
    rules: Record<string, Rule>
  ) => Promise<void>
  defaultConfig: DefaultConfig
}

async function loadWisemenDanger (): Promise<WisemenDangerModule> {
  const modulePath = path.join(cwd, 'node_modules', '@wisemen', 'danger', 'dist', 'index.js')

  return await import(modulePath) as WisemenDangerModule
}

interface ClientDangerfileModule {
  configureDanger?: (config: DefaultConfig) => DefaultConfig
  rules?: Record<string, Rule>
}

/**
 * Try to import a client Dangerfile, preferring `.js` then falling back to `.ts`.
 * Returns undefined (rather than throwing) when neither exists - "no dangerfile here"
 * is an expected, normal outcome for scopes the consumer hasn't opted into.
 * @param basePath - Absolute path to the dangerfile without extension
 */
async function tryLoadDangerfileModule (
  basePath: string
): Promise<ClientDangerfileModule | undefined> {
  for (const candidate of [`${basePath}.js`, `${basePath}.ts`]) {
    try {
      return await import(candidate) as ClientDangerfileModule
    } catch {
      // No dangerfile at this path with this extension; try the next candidate.
    }
  }

  return undefined
}

interface ScopedDangerfile {
  /** Base path this dangerfile's rules are scoped to; '' means the whole repo. */
  scope: string
  module: ClientDangerfileModule
}

/**
 * Discover every dangerfile the consuming monorepo defines: the root dangerfile
 * (whole repo) plus one per `apps/<name>` folder that contains one.
 */
async function discoverDangerfiles (): Promise<ScopedDangerfile[]> {
  const discovered: ScopedDangerfile[] = []

  const rootModule = await tryLoadDangerfileModule(path.join(cwd, 'dangerfile'))

  if (rootModule != null) {
    discovered.push({ scope: '', module: rootModule })
  }

  const appsDir = path.join(cwd, 'apps')

  if (fs.existsSync(appsDir)) {
    const appNames = fs.readdirSync(appsDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()

    for (const appName of appNames) {
      const appModule = await tryLoadDangerfileModule(path.join(appsDir, appName, 'dangerfile'))

      if (appModule != null) {
        discovered.push({ scope: `apps/${appName}`, module: appModule })
      }
    }
  }

  return discovered
}

// Danger's CLI runners never call the Dangerfile's default export with an argument -
// they inject `danger` (along with `warn`/`fail`/`message`) as a global instead.
declare const danger: DangerDSLType

export default async () => {
  const { runDangerWithRules, defaultConfig } = await loadWisemenDanger()
  const dangerfiles = await discoverDangerfiles()

  if (dangerfiles.length === 0) {
    // No client dangerfile anywhere - still run the built-in rules against the whole repo.
    await runDangerWithRules(danger, defaultConfig, {})

    return
  }

  for (const { scope, module } of dangerfiles) {
    let config: DefaultConfig = { ...structuredClone(defaultConfig), scope }
    const rules: Record<string, Rule> = {}

    if (typeof module.configureDanger === 'function') {
      config = module.configureDanger(config)
    }

    if (module.rules != null) {
      Object.assign(rules, module.rules)
    }

    await runDangerWithRules(danger, config, rules)
  }
}
