import chalk from 'chalk'

import { loadConfig } from '../config.js'
import { runSync } from '../sync-core.js'
import type { TargetName } from '../types.js'

export interface CheckOptions {
  cwd: string
  silent: boolean
  targets?: TargetName[]
  verbose: boolean
}

export async function check(options: CheckOptions): Promise<number> {
  const config = await loadConfig(options.cwd)

  if (options.targets !== undefined && options.targets.length > 0) {
    config.targets = options.targets
  }
  const log = (msg: string): void => {
    if (!options.silent) { console.log(msg) }
  }

  try {
    const {
      changes,
    } = await runSync(options.cwd, config, {
      apply: false,
    })
    const drift = changes.filter((c) => c.kind !== 'unchanged')

    if (drift.length === 0) {
      log(chalk.green('wisemen-skills: in sync.'))

      return 0
    }

    log(chalk.red(`wisemen-skills: ${String(drift.length)} file(s) out of sync. Run \`pnpm skills:sync\`.`))

    if (options.verbose) {
      for (const change of drift) {
        const symbol = change.kind === 'create' ? '+' : (change.kind === 'update' ? '~' : '-')

        log(`  ${symbol} ${change.path}`)
      }
    }
    else {
      for (const change of drift.slice(0, 10)) {
        const symbol = change.kind === 'create' ? '+' : (change.kind === 'update' ? '~' : '-')

        log(`  ${symbol} ${change.path}`)
      }
      if (drift.length > 10) { log(`  ... and ${String(drift.length - 10)} more`) }
    }

    return 1
  }
  catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_))

    if (!options.silent) { console.error(chalk.red(`wisemen-skills check failed: ${error.message}`)) }

    return 1
  }
}
