import chalk from 'chalk'

import { Logger } from '@/logger.js'

import { loadConfig } from '../config.js'
import { runSync } from '../sync-core.js'

interface CheckOptions {
  cwd: string
  silent: boolean
  verbose: boolean
}

export async function check(options: CheckOptions): Promise<number> {
  const config = loadConfig(options.cwd)

  const logger = new Logger({
    silent: options.silent,
  })

  try {
    const {
      changes,
    } = await runSync(options.cwd, config, {
      apply: false,
    })
    const drift = changes.filter((c) => c.kind !== 'unchanged')

    if (drift.length === 0) {
      logger.log(chalk.green('wisemen-skills: in sync.'))

      return 0
    }

    logger.log(chalk.red(`wisemen-skills: ${String(drift.length)} file(s) out of sync. Run \`pnpm skills:sync\`.`))

    for (let i = 0; i < drift.length; i++) {
      if (!options.verbose && i >= 10) {
        logger.log(`  ... and ${String(drift.length - 10)} more`)

        break
      }
      const change = drift[i]

      // eslint-disable-next-line no-nested-ternary
      const symbol = change.kind === 'create' ? '+' : (change.kind === 'update' ? '~' : '-')

      logger.log(`  ${symbol} ${change.path}`)
    }

    return 1
  }
  catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_))

    logger.error(`wisemen-skills check failed: ${error.message}`)

    return 1
  }
}
