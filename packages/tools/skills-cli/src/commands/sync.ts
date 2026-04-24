import chalk from 'chalk'

import { loadConfig } from '../config.js'
import { runSync } from '../sync-core.js'
import type { TargetName } from '../types.js'

export interface SyncOptions {
  cwd: string
  dryRun: boolean
  silent: boolean
  targets?: TargetName[]
  verbose: boolean
}

export async function sync(options: SyncOptions): Promise<number> {
  const config = await loadConfig(options.cwd)

  if (options.targets !== undefined && options.targets.length > 0) {
    config.targets = options.targets
  }
  const log = (msg: string): void => {
    if (!options.silent) { console.log(msg) }
  }
  const verbose = (msg: string): void => {
    if (options.verbose && !options.silent) { console.log(msg) }
  }

  try {
    const {
      changes, packages,
    } = await runSync(options.cwd, config, {
      apply: !options.dryRun,
    })

    const mutations = changes.filter((c) => c.kind !== 'unchanged')

    if (mutations.length === 0) {
      log(chalk.gray(`wisemen-skills: ${packages.length} package(s) scanned, nothing to update.`))

      return 0
    }

    const action = options.dryRun ? 'would change' : 'updated'

    log(chalk.cyan(`wisemen-skills: ${action} ${String(mutations.length)} file(s) across ${String(packages.length)} package(s).`))

    for (const change of mutations) {
      const symbol = change.kind === 'create' ? '+' : (change.kind === 'update' ? '~' : '-')
      const color = change.kind === 'create' ? chalk.green : (change.kind === 'update' ? chalk.yellow : chalk.red)

      verbose(color(`  ${symbol} ${change.path}`))
    }

    return 0
  }
  catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_))

    if (!options.silent) { console.error(chalk.red(`wisemen-skills sync failed: ${error.message}`)) }

    return 1
  }
}
