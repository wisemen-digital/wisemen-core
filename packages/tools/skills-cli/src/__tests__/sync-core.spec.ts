import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { runSync } from '../sync-core.js'
import type { ResolvedConfig } from '../types.js'

const config: ResolvedConfig = {
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
    unscoped: [],
  },
  targets: [
    'claude',
  ],
}

function setupFixture(): string {
  const root = mkdtempSync(path.join(tmpdir(), 'wisemen-skills-sync-'))
  const pkgDir = path.join(root, 'node_modules', '@wisemen', 'vue-core-api-utils')
  const skillDir = path.join(pkgDir, 'skills', 'foundations')

  mkdirSync(skillDir, {
    recursive: true,
  })
  writeFileSync(
    path.join(pkgDir, 'package.json'),
    JSON.stringify({
      name: '@wisemen/vue-core-api-utils',
      version: '1.2.0',
    }, null, 2),
  )
  writeFileSync(
    path.join(skillDir, 'SKILL.md'),
    '---\nname: foundations\ndescription: Explains things.\n---\n# Body\n',
  )

  return root
}

describe('runSync', () => {
  let root = ''

  beforeEach(() => {
    root = setupFixture()
  })
  afterEach(() => {
    if (root.length > 0) {
      rmSync(root, {
        force: true,
        recursive: true,
      })
    }
  })

  it('creates skill files, index, and lockfile on first run', async () => {
    const {
      changes, packages,
    } = await runSync(root, config)

    expect(packages).toHaveLength(1)

    const creates = changes.filter((c) => c.kind === 'create')

    expect(creates.length).toBeGreaterThanOrEqual(3)

    const skillPath = path.join(root, '.claude', 'skills', 'wisemen', 'vue-core-api-utils', 'foundations', 'SKILL.md')

    expect(existsSync(skillPath)).toBeTruthy()
    expect(readFileSync(skillPath, 'utf8')).toContain('name: foundations')

    const indexPath = path.join(root, '.claude', 'skills', 'wisemen', 'INDEX.md')

    expect(existsSync(indexPath)).toBeTruthy()
    expect(readFileSync(indexPath, 'utf8')).toContain('vue-core-api-utils')

    const lockPath = path.join(root, '.wisemen-skills.lock.json')

    expect(existsSync(lockPath)).toBeTruthy()

    const lock = JSON.parse(readFileSync(lockPath, 'utf8'))

    expect(lock.entries).toHaveLength(1)
    expect(lock.entries[0].package).toBe('@wisemen/vue-core-api-utils')
    expect(lock.generatedAt).toBeDefined()
  })

  it('produces zero mutations on second run', async () => {
    await runSync(root, config)

    const {
      changes,
    } = await runSync(root, config)
    const mutations = changes.filter((c) => c.kind !== 'unchanged')

    expect(mutations).toHaveLength(0)
  })

  it('cleans up stale skill files', async () => {
    await runSync(root, config)

    const staleDir = path.join(root, '.claude', 'skills', 'wisemen', 'removed-pkg', 'old-skill')

    mkdirSync(staleDir, {
      recursive: true,
    })
    writeFileSync(path.join(staleDir, 'SKILL.md'), '# stale')

    const {
      changes,
    } = await runSync(root, config)
    const deletes = changes.filter((c) => c.kind === 'delete')

    expect(deletes.length).toBeGreaterThanOrEqual(1)
    expect(existsSync(path.join(staleDir, 'SKILL.md'))).toBeFalsy()
    expect(existsSync(path.join(root, '.claude', 'skills', 'wisemen', 'removed-pkg'))).toBeFalsy()
  })

  it('reports drift without writing in dry-run mode', async () => {
    const {
      changes,
    } = await runSync(root, config, {
      apply: false,
    })
    const creates = changes.filter((c) => c.kind === 'create')

    expect(creates.length).toBeGreaterThanOrEqual(3)

    const skillPath = path.join(root, '.claude', 'skills', 'wisemen', 'vue-core-api-utils', 'foundations', 'SKILL.md')

    expect(existsSync(skillPath)).toBeFalsy()
  })

  it('discovers unscoped packages from config', async () => {
    const unscopedDir = path.join(root, 'node_modules', 'formango')
    const skillDir = path.join(unscopedDir, 'skills', 'form-setup')

    mkdirSync(skillDir, {
      recursive: true,
    })
    writeFileSync(
      path.join(unscopedDir, 'package.json'),
      JSON.stringify({
        name: 'formango',
        version: '3.2.0',
      }, null, 2),
    )
    writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      '---\nname: form-setup\ndescription: Set up forms.\n---\n# Forms\n',
    )

    const {
      packages,
    } = await runSync(root, {
      ...config,
      packages: {
        ...config.packages,
        unscoped: [
          'formango',
        ],
      },
    })

    expect(packages).toHaveLength(2)
    expect(packages.some((p) => p.name === 'formango')).toBeTruthy()
  })
})
