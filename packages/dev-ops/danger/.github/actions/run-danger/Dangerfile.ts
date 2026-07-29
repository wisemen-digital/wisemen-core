// Dangerfile wrapper for danger-runner
// Stored in action folder, runs with --dangerfile ${{ github.action_path }}/dangerfile.ts

import * as path from 'path'
import type { DangerDSLType } from 'danger'
import type { DefaultConfig, Rule } from 'dist/lib/index.js'
import { runDangerWithRules, defaultConfig } from 'dist/lib/index.js'

const cwd = process.cwd()

// Try to load client's Dangerfile (support both .js and .ts)
const dangerfilePaths = [
  path.join(cwd, 'dangerfile.js'),
  path.join(cwd, 'dangerfile.ts')
]

interface ClientDangerfileModule {
  configureDanger?: (config: DefaultConfig) => DefaultConfig
  rules?: Record<string, Rule>
}

async function loadClientDangerfile ():
Promise<{ config: DefaultConfig, rules: Record<string, Rule> }> {
  let clientConfig: DefaultConfig = defaultConfig
  const clientRules: Record<string, Rule> = {}

  for (const dangerfilePath of dangerfilePaths) {
    try {
      const clientDangerfile = await import(dangerfilePath) as ClientDangerfileModule

      if (typeof clientDangerfile.configureDanger === 'function') {
        clientConfig = clientDangerfile.configureDanger(structuredClone(defaultConfig))
      }

      if (clientDangerfile.rules != null) {
        Object.assign(clientRules, clientDangerfile.rules)
      }

      // Successfully loaded a Dangerfile, stop trying
      break
    } catch {
      // No dangerfile at this path with this extension; try the next candidate.
    }
  }

  return { config: clientConfig, rules: clientRules }
}

// Danger's CLI runners never call the Dangerfile's default export with an argument -
// they inject `danger` (along with `warn`/`fail`/`message`) as a global instead.
declare const danger: DangerDSLType

export default async () => {
  const { config, rules } = await loadClientDangerfile()

  await runDangerWithRules(danger, config, rules)
}
