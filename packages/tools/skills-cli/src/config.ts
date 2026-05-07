import {
  existsSync,
  readFileSync,
} from 'node:fs'
import path from 'node:path'

import type {
  Config,
  ResolvedConfig,
} from './types.js'

const CONFIG_FILENAME = 'wisemen-skills.config.json'

const DEFAULT_CONFIG: ResolvedConfig = {
  packages: {
    allow: null,
    deny: [],
    unscoped: [
      'formango',
    ],
  },
}

function loadRawConfig(projectRoot: string): Config {
  const candidate = path.join(projectRoot, CONFIG_FILENAME)

  if (!existsSync(candidate)) {
    return {}
  }

  return JSON.parse(readFileSync(candidate, 'utf8')) as Config
}

export function loadConfig(projectRoot: string): ResolvedConfig {
  const raw = loadRawConfig(projectRoot)

  return {
    packages: {
      allow: raw.packages?.allow ?? DEFAULT_CONFIG.packages.allow,
      deny: raw.packages?.deny ?? DEFAULT_CONFIG.packages.deny,
      unscoped: raw.packages?.unscoped ?? DEFAULT_CONFIG.packages.unscoped,
    },
  }
}
