import {
  existsSync,
  readFileSync,
} from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import type {
  Config,
  ResolvedConfig,
  TargetName,
} from './types.js'

const DEFAULT_CONFIG: ResolvedConfig = {
  agentsMd: {
    path: 'AGENTS.md',
  },
  claude: {
    outDir: '.claude/skills/wisemen',
  },
  llmsTxt: {
    path: 'llms.txt',
  },
  packages: {
    allow: null,
    deny: [],
    unscoped: [
      'formango',
    ],
  },
  targets: [
    'claude',
    'agents-md',
    'llms-txt',
  ],
}

const CONFIG_FILENAMES = [
  'wisemen-skills.config.ts',
  'wisemen-skills.config.mts',
  'wisemen-skills.config.mjs',
  'wisemen-skills.config.js',
  'wisemen-skills.config.json',
]

async function loadRawConfig(projectRoot: string): Promise<Config> {
  for (const name of CONFIG_FILENAMES) {
    const candidate = path.join(projectRoot, name)

    if (!existsSync(candidate)) { continue }

    if (name.endsWith('.json')) {
      return JSON.parse(readFileSync(candidate, 'utf8')) as Config
    }

    const mod = await import(pathToFileURL(candidate).href) as { default?: Config } & Config

    return mod.default ?? mod
  }

  return {}
}

export async function loadConfig(projectRoot: string): Promise<ResolvedConfig> {
  const raw = await loadRawConfig(projectRoot)

  return {
    agentsMd: {
      path: raw.agentsMd?.path ?? DEFAULT_CONFIG.agentsMd.path,
    },
    claude: {
      outDir: raw.claude?.outDir ?? DEFAULT_CONFIG.claude.outDir,
    },
    llmsTxt: {
      path: raw.llmsTxt?.path ?? DEFAULT_CONFIG.llmsTxt.path,
    },
    packages: {
      allow: raw.packages?.allow ?? DEFAULT_CONFIG.packages.allow,
      deny: raw.packages?.deny ?? DEFAULT_CONFIG.packages.deny,
      unscoped: raw.packages?.unscoped ?? DEFAULT_CONFIG.packages.unscoped,
    },
    targets: (raw.targets ?? DEFAULT_CONFIG.targets) as TargetName[],
  }
}
