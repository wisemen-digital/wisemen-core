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

  it('honors allow list', async () => {
    const otherPkg = path.join(root, 'node_modules', '@wisemen', 'other-pkg')
    const otherSkill = path.join(otherPkg, 'skills', 'usage')

    mkdirSync(otherSkill, {
      recursive: true,
    })
    writeFileSync(
      path.join(otherPkg, 'package.json'),
      JSON.stringify({
        name: '@wisemen/other-pkg',
        version: '0.1.0',
      }),
    )
    writeFileSync(
      path.join(otherSkill, 'SKILL.md'),
      '---\nname: usage\ndescription: How to use.\n---\n# Usage\n',
    )

    const packages = await discoverPackages(root, {
      ...config,
      packages: {
        allow: [
          '@wisemen/other-pkg',
        ],
        deny: [],
        unscoped: [],
      },
    })

    expect(packages).toHaveLength(1)
    expect(packages[0]?.name).toBe('@wisemen/other-pkg')
  })

  it('discovers unscoped packages listed in config', async () => {
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
      }),
    )
    writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      '---\nname: form-setup\ndescription: Set up forms.\n---\n# Forms\n',
    )

    const packages = await discoverPackages(root, {
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

  it('skips packages without a skills folder', async () => {
    const emptyPkg = path.join(root, 'node_modules', '@wisemen', 'no-skills')

    mkdirSync(emptyPkg, {
      recursive: true,
    })
    writeFileSync(
      path.join(emptyPkg, 'package.json'),
      JSON.stringify({
        name: '@wisemen/no-skills',
        version: '1.0.0',
      }),
    )

    const packages = await discoverPackages(root, config)

    expect(packages).toHaveLength(1)
    expect(packages[0]?.name).toBe('@wisemen/vue-core-api-utils')
  })

  it('respects custom wisemen.skills path', async () => {
    const customPkg = path.join(root, 'node_modules', '@wisemen', 'custom-path')
    const customSkills = path.join(customPkg, '.ai', 'docs')

    mkdirSync(customSkills, {
      recursive: true,
    })
    writeFileSync(
      path.join(customPkg, 'package.json'),
      JSON.stringify({
        name: '@wisemen/custom-path',
        version: '1.0.0',
        wisemen: {
          skills: './.ai/docs',
        },
      }),
    )
    writeFileSync(
      path.join(customSkills, 'SKILL.md'),
      '---\nname: custom-skill\ndescription: Custom location.\n---\n# Custom\n',
    )

    const packages = await discoverPackages(root, config)
    const custom = packages.find((p) => p.name === '@wisemen/custom-path')

    expect(custom).toBeDefined()
    expect(custom?.skills[0]?.skillName).toBe('custom-skill')
  })
})
