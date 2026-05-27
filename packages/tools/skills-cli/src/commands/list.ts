import chalk from 'chalk'

import { Logger } from '@/logger.js'

import { loadConfig } from '../config.js'
import { discoverPackages } from '../discover.js'

interface ListOptions {
  cwd: string
  silent: boolean
}

export async function list(options: ListOptions): Promise<number> {
  const config = loadConfig(options.cwd)

  const logger = new Logger({
    silent: options.silent,
  })

  try {
    const packages = await discoverPackages(options.cwd, config)

    if (packages.length === 0) {
      logger.log(chalk.gray('No `@wisemen/*` packages with skills found in node_modules.'))

      return 0
    }

    for (const pkg of packages) {
      logger.log(chalk.cyan(`${pkg.name} @ ${pkg.version}`))

      for (const skill of pkg.skills) {
        const description = String(skill.frontmatter.description).split('\n')[0]?.trim() ?? ''

        logger.log(`  - ${chalk.bold(skill.skillName)} — ${description}`)
      }
    }

    return 0
  }
  catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_))

    logger.error(`wisemen-skills list failed: ${error.message}`)

    return 1
  }
}
