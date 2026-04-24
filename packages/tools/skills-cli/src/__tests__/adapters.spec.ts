import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  agentsMdAdapter,
  agentsMdMergeHelpers,
} from '../adapters/agents-md.js'
import { claudeAdapter } from '../adapters/claude.js'
import { llmsTxtAdapter } from '../adapters/llms-txt.js'
import type {
  AdapterContext,
  DiscoveredPackage,
  DiscoveredSkill,
} from '../types.js'

function makeSkill(
  skillName: string,
  packageShortName: string,
  description: string,
): DiscoveredSkill {
  const raw = `---\nname: ${skillName}\ndescription: ${description}\n---\n# ${skillName}\n\nBody.\n`

  return {
    body: `# ${skillName}\n\nBody.\n`,
    frontmatter: {
      name: skillName,
      description,
    },
    packageName: `@wisemen/${packageShortName}`,
    packageShortName,
    packageVersion: '1.2.0',
    raw,
    skillName,
    skillPath: `/abs/node_modules/@wisemen/${packageShortName}/skills/${skillName}/SKILL.md`,
  }
}

function makeCtx(packages: DiscoveredPackage[]): AdapterContext {
  return {
    config: {
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
        'agents-md',
        'llms-txt',
      ],
    },
    packages,
    projectRoot: '/project',
  }
}

describe('claudeAdapter', () => {
  it('emits one SKILL.md per skill plus INDEX', () => {
    const skill = makeSkill('foundations', 'vue-core-api-utils', 'Does things.')
    const ctx = makeCtx([
      {
        name: '@wisemen/vue-core-api-utils',
        shortName: 'vue-core-api-utils',
        skills: [
          skill,
        ],
        skillsDir: '/mock',
        version: '1.2.0',
      },
    ])
    const files = claudeAdapter.render(ctx)
    const paths = files.map((f) => f.path)

    expect(paths).toContain('.claude/skills/wisemen/vue-core-api-utils/foundations/SKILL.md')
    expect(paths).toContain('.claude/skills/wisemen/INDEX.md')

    const skillFile = files.find((f) => f.path.endsWith('foundations/SKILL.md'))

    expect(skillFile?.content).toContain('---')
    expect(skillFile?.content).toContain('name: foundations')
  })
})

describe('agentsMdAdapter', () => {
  it('renders a fenced section', () => {
    const ctx = makeCtx([
      {
        name: '@wisemen/vue-core-api-utils',
        shortName: 'vue-core-api-utils',
        skills: [
          makeSkill('foundations', 'vue-core-api-utils', 'Explains AsyncResult.'),
        ],
        skillsDir: '/mock',
        version: '1.2.0',
      },
    ])
    const [
      file,
    ] = agentsMdAdapter.render(ctx)

    expect(file?.content).toContain(agentsMdMergeHelpers.START_MARKER)
    expect(file?.content).toContain(agentsMdMergeHelpers.END_MARKER)
    expect(file?.content).toContain('vue-core-api-utils @ 1.2.0')
    expect(file?.content).toContain('**foundations**')
  })

  it('merges with existing AGENTS.md content outside markers', () => {
    const existing = '# AGENTS.md\n\n## Custom rules\n\nKeep hand-written content.\n'
    const ctx = makeCtx([
      {
        name: '@wisemen/vue-core-api-utils',
        shortName: 'vue-core-api-utils',
        skills: [
          makeSkill('foundations', 'vue-core-api-utils', 'Explains AsyncResult.'),
        ],
        skillsDir: '/mock',
        version: '1.2.0',
      },
    ])
    const [
      file,
    ] = agentsMdAdapter.render(ctx)
    const fresh = file?.content ?? ''
    const sectionStart = fresh.indexOf(agentsMdMergeHelpers.START_MARKER)
    const section = fresh.slice(sectionStart)
    const merged = agentsMdMergeHelpers.composeContent(existing, section)

    expect(merged).toContain('# AGENTS.md')
    expect(merged).toContain('Keep hand-written content.')
    expect(merged).toContain(agentsMdMergeHelpers.START_MARKER)
    expect(merged).toContain(agentsMdMergeHelpers.END_MARKER)
  })

  it('replaces an existing fenced section in place', () => {
    const existing = [
      '# AGENTS.md',
      '',
      '## Custom',
      'Top content.',
      '',
      agentsMdMergeHelpers.START_MARKER,
      '## Skills from `@wisemen/*` packages',
      'OLD',
      agentsMdMergeHelpers.END_MARKER,
      '',
      '## Footer',
      '',
    ].join('\n')
    const ctx = makeCtx([
      {
        name: '@wisemen/vue-core-api-utils',
        shortName: 'vue-core-api-utils',
        skills: [
          makeSkill('foundations', 'vue-core-api-utils', 'New content.'),
        ],
        skillsDir: '/mock',
        version: '1.2.0',
      },
    ])
    const [
      file,
    ] = agentsMdAdapter.render(ctx)
    const fresh = file?.content ?? ''
    const sectionStart = fresh.indexOf(agentsMdMergeHelpers.START_MARKER)
    const section = fresh.slice(sectionStart)
    const merged = agentsMdMergeHelpers.composeContent(existing, section)

    expect(merged).toContain('Top content.')
    expect(merged).toContain('## Footer')
    expect(merged).not.toContain('OLD')
    expect(merged).toContain('New content.')
  })
})

describe('llmsTxtAdapter', () => {
  it('emits a single file at the configured path', () => {
    const ctx = makeCtx([
      {
        name: '@wisemen/vue-core-api-utils',
        shortName: 'vue-core-api-utils',
        skills: [
          makeSkill('foundations', 'vue-core-api-utils', 'Does things.'),
        ],
        skillsDir: '/mock',
        version: '1.2.0',
      },
    ])
    const files = llmsTxtAdapter.render(ctx)

    expect(files).toHaveLength(1)
    expect(files[0]?.path).toBe('llms.txt')
    expect(files[0]?.content).toContain('# Wisemen Skills')
    expect(files[0]?.content).toContain('@wisemen/vue-core-api-utils @ 1.2.0')
  })
})
