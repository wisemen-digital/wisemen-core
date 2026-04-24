import {
  mkdirSync,
  mkdtempSync,
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

import { discoverPackages } from '../discover.js'
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
  const root = mkdtempSync(path.join(tmpdir(), 'wisemen-skills-'))
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
    '---\nname: foundations\ndescription: Explains things.\nlibrary_version: ">=1.0.0 <2.0.0"\n---\n# Body\n',
  )

  return root
}

describe('discoverPackages', () => {
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

  it('discovers scoped @wisemen packages that ship a skills folder', async () => {
    const packages = await discoverPackages(root, config)

    expect(packages).toHaveLength(1)
    expect(packages[0]?.name).toBe('@wisemen/vue-core-api-utils')
    expect(packages[0]?.skills).toHaveLength(1)
    expect(packages[0]?.skills[0]?.skillName).toBe('foundations')
  })

  it('keeps skills regardless of library_version (informational only)', async () => {
    const pkgDir = path.join(root, 'node_modules', '@wisemen', 'vue-core-api-utils')

    writeFileSync(
      path.join(pkgDir, 'skills', 'foundations', 'SKILL.md'),
      '---\nname: foundations\ndescription: Stale metadata.\nlibrary_version: "0.0.3"\n---\nBody\n',
    )

    const packages = await discoverPackages(root, config)

    expect(packages).toHaveLength(1)
    expect(packages[0]?.skills[0]?.frontmatter.library_version).toBe('0.0.3')
  })

  it('honors deny list', async () => {
    const packages = await discoverPackages(root, {
      ...config,
      packages: {
        allow: null,
        deny: [
          '@wisemen/vue-core-api-utils',
        ],
        unscoped: [],
      },
    })

    expect(packages).toHaveLength(0)
  })
})
