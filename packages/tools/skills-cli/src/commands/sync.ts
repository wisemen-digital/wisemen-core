/* eslint-disable no-nested-ternary */
import chalk from 'chalk'

import { Logger } from '@/logger.js'

import { loadConfig } from '../config.js'
import { runSync } from '../sync-core.js'

interface SyncOptions {
  cwd: string
  dryRun: boolean
  silent: boolean
  verbose: boolean
}

export async function sync(options: SyncOptions): Promise<number> {
  const config = loadConfig(options.cwd)

  const logger = new Logger({
    silent: options.silent,
    verbose: options.verbose,
  })

  try {
    const {
      changes, packages,
    } = await runSync(options.cwd, config, {
      apply: !options.dryRun,
    })

    const mutations = changes.filter((c) => c.kind !== 'unchanged')

    if (mutations.length === 0) {
      logger.log(chalk.gray(`wisemen-skills: ${packages.length} package(s) scanned, nothing to update.`))

      return 0
    }

    const action = options.dryRun ? 'would change' : 'updated'

    logger.log(chalk.cyan(`wisemen-skills: ${action} ${String(mutations.length)} file(s) across ${String(packages.length)} package(s).`))

    for (const change of mutations) {
      const symbol = change.kind === 'create' ? '+' : (change.kind === 'update' ? '~' : '-')
      const color = change.kind === 'create' ? chalk.green : (change.kind === 'update' ? chalk.yellow : chalk.red)

      logger.verbose(color(`  ${symbol} ${change.path}`))
    }

    return 0
  }
  catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_))

    logger.error(chalk.red(`wisemen-skills sync failed: ${error.message}`))

    return 1
  }
}
