import chalk from 'chalk'

import { loadConfig } from '../config.js'
import { discoverPackages } from '../discover.js'

export interface ListOptions {
  cwd: string
  silent: boolean
}

export async function list(options: ListOptions): Promise<number> {
  const config = await loadConfig(options.cwd)
  const log = (msg: string): void => {
    if (!options.silent) { console.log(msg) }
  }

  try {
    const packages = await discoverPackages(options.cwd, config)

    if (packages.length === 0) {
      log(chalk.gray('No `@wisemen/*` packages with skills found in node_modules.'))

      return 0
    }
    for (const pkg of packages) {
      log(chalk.cyan(`${pkg.name} @ ${pkg.version}`))

      for (const skill of pkg.skills) {
        const description = String(skill.frontmatter.description).split('\n')[0]?.trim() ?? ''

        log(`  - ${chalk.bold(skill.skillName)} — ${description}`)
      }
    }

    return 0
  }
  catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_))

    if (!options.silent) { console.error(chalk.red(`wisemen-skills list failed: ${error.message}`)) }

    return 1
  }
}
