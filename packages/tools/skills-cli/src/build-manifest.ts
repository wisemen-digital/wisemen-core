import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

import fg from 'fast-glob'

import { parseFrontmatter } from './frontmatter.js'

export interface ManifestSkill {
  name: string
  description: string
  library_version?: string
  requires?: string[]
  type?: string
  path: string
}

export interface SkillManifest {
  generatedBy: '@wisemen/skills-cli'
  skills: ManifestSkill[]
  version: 1
}

export interface BuildManifestOptions {
  manifestPath?: string
  skillsDir?: string
}

export function buildManifest(options: BuildManifestOptions = {}): SkillManifest {
  const skillsDir = path.resolve(options.skillsDir ?? 'skills')

  if (!existsSync(skillsDir)) {
    throw new Error(`skills directory does not exist: ${skillsDir}`)
  }
  const files = fg.sync('**/SKILL.md', {
    absolute: true,
    cwd: skillsDir,
  })
  const skills: ManifestSkill[] = []

  for (const file of files) {
    const {
      frontmatter,
    } = parseFrontmatter(readFileSync(file, 'utf8'))
    const relative = path.relative(skillsDir, file).split(path.sep).join('/')

    skills.push({
      name: frontmatter.name,
      description: frontmatter.description,
      ...(typeof frontmatter.type === 'string'
        ? {
            type: frontmatter.type,
          }
        : {}),
      ...(typeof frontmatter.library_version === 'string'
        ? {
            library_version: frontmatter.library_version,
          }
        : {}),
      path: relative,
      ...(Array.isArray(frontmatter.requires)
        ? {
            requires: frontmatter.requires as string[],
          }
        : {}),
    })
  }

  skills.sort((a, b) => a.name.localeCompare(b.name))

  return {
    generatedBy: '@wisemen/skills-cli',
    skills,
    version: 1,
  }
}

export function writeManifest(options: BuildManifestOptions = {}): string {
  const skillsDir = path.resolve(options.skillsDir ?? 'skills')
  const manifestPath = options.manifestPath ?? path.join(skillsDir, 'manifest.json')
  const manifest = buildManifest({
    skillsDir,
  })
  const content = `${JSON.stringify(manifest, null, 2)}\n`

  writeFileSync(manifestPath, content)

  return manifestPath
}

