import yaml from 'js-yaml'

import type { SkillFrontmatter } from './types.js'

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export interface ParsedMarkdown {
  body: string
  frontmatter: SkillFrontmatter
}

export function parseFrontmatter(source: string): ParsedMarkdown {
  const match = FRONTMATTER_PATTERN.exec(source)

  if (match === null) {
    throw new Error('Skill file is missing YAML frontmatter')
  }
  const frontmatter = yaml.load(match[1] ?? '') as SkillFrontmatter | null

  if (frontmatter === null || typeof frontmatter !== 'object') {
    throw new Error('Skill frontmatter must be a YAML mapping')
  }
  if (typeof frontmatter.name !== 'string' || frontmatter.name.length === 0) {
    throw new Error('Skill frontmatter is missing required field: name')
  }
  if (typeof frontmatter.description !== 'string' || frontmatter.description.length === 0) {
    throw new Error('Skill frontmatter is missing required field: description')
  }
  const body = source.slice(match[0].length)

  return {
    body,
    frontmatter,
  }
}
