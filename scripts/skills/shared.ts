import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
export const MANAGED_SKILLS_DIR = resolve(REPO_ROOT, '.agents/skills')
export const TEMPLATE_ROOT = resolve(REPO_ROOT, '.agents/templates/skills')
export const CLAUDE_SKILLS_DIR = resolve(REPO_ROOT, '.claude/skills')
export const GENERATED_MARKER = '.generated-by-wisemen-skills'
export const TEMPLATE_MARKER_REGEX = /<!--\s*skill-template:\s*(knowledge|workflow|scripted)@(\d+)\s*-->/
export const TEMPLATE_VERSION = '1'

export type TemplateId = 'knowledge' | 'workflow' | 'scripted'

export const TEMPLATE_CONFIG: Record<TemplateId, {
  headings: string[]
  resourceDirs: string[]
}> = {
  knowledge: {
    headings: ['## Scope', '## Use', '## Rules', '## References'],
    resourceDirs: ['references'],
  },
  workflow: {
    headings: ['## Scope', '## Inputs', '## Process', '## Verification'],
    resourceDirs: ['references'],
  },
  scripted: {
    headings: ['## Scope', '## Inputs', '## Scripts', '## Process', '## Verification'],
    resourceDirs: ['scripts', 'references', 'assets'],
  },
}

export interface ManagedSkill {
  dir: string
  name: string
}

export interface SkillFrontmatter {
  name: string
  description: string
  extraKeys: string[]
}

export function toTitleCase(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(' ')
}

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]!

    if (!token.startsWith('--')) {
      continue
    }

    const key = token.slice(2)
    const next = argv[index + 1]

    if (!next || next.startsWith('--')) {
      args[key] = true
      continue
    }

    args[key] = next
    index += 1
  }

  return args
}

export function ensureDirectory(path: string): void {
  mkdirSync(path, { recursive: true })
}

export function writeTextFile(path: string, content: string): void {
  ensureDirectory(dirname(path))
  writeFileSync(path, content, 'utf8')
}

export function listManagedSkills(): ManagedSkill[] {
  if (!existsSync(MANAGED_SKILLS_DIR)) {
    return []
  }

  return readdirSync(MANAGED_SKILLS_DIR)
    .map((entry) => {
      const dir = resolve(MANAGED_SKILLS_DIR, entry)
      return { dir, name: entry }
    })
    .filter(({ dir }) => statSync(dir).isDirectory() && existsSync(resolve(dir, 'SKILL.md')))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function readText(path: string): string {
  return readFileSync(path, 'utf8')
}

export function parseFrontmatter(markdown: string): SkillFrontmatter {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/u)

  if (!match) {
    throw new Error('missing YAML frontmatter')
  }

  const keys = new Map<string, string>()
  const extraKeys: string[] = []

  for (const line of match[1]!.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed) {
      continue
    }

    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex === -1) {
      throw new Error(`invalid frontmatter line: ${line}`)
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, '')

    keys.set(key, value)

    if (key !== 'name' && key !== 'description') {
      extraKeys.push(key)
    }
  }

  const name = keys.get('name')
  const description = keys.get('description')

  if (!name || !description) {
    throw new Error('frontmatter must contain name and description')
  }

  return { name, description, extraKeys }
}

export function extractBody(markdown: string): string {
  const match = markdown.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/u)
  return match ? match[1]! : markdown
}

export function getTemplateMarker(body: string): { templateId: TemplateId, version: string } | null {
  const match = body.match(TEMPLATE_MARKER_REGEX)

  if (!match) {
    return null
  }

  return {
    templateId: match[1] as TemplateId,
    version: match[2]!,
  }
}

export function getMarkdownLinks(markdown: string): string[] {
  const links: string[] = []

  for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/gu)) {
    links.push(match[1]!)
  }

  return links
}

export function isExternalLink(target: string): boolean {
  return /^(?:[a-z]+:|#)/iu.test(target)
}

export function lineCount(content: string): number {
  return content.split('\n').length
}

export function relativePath(path: string): string {
  return relative(REPO_ROOT, path) || '.'
}

export function readTemplate(templateId: TemplateId, relativePathWithinTemplate: string): string {
  const path = resolve(TEMPLATE_ROOT, templateId, relativePathWithinTemplate)
  return readText(path)
}

export function renderTemplate(content: string, values: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\}\}/gu, (_, key) => values[key] ?? '')
}

export function readOpenAiYaml(path: string): Record<string, string> {
  const data = readText(path)
  const result: Record<string, string> = {}

  for (const line of data.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed) {
      continue
    }

    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex === -1) {
      throw new Error(`invalid YAML line in ${relativePath(path)}: ${line}`)
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
    result[key] = value
  }

  return result
}

export function copyDirectory(source: string, destination: string): void {
  ensureDirectory(dirname(destination))
  cpSync(source, destination, { recursive: true })
}

export function removeDirectory(path: string): void {
  rmSync(path, { recursive: true, force: true })
}

export function collectFileMap(dir: string, baseDir = dir): Map<string, string> {
  const files = new Map<string, string>()

  if (!existsSync(dir)) {
    return files
  }

  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      for (const [relativeFile, content] of collectFileMap(fullPath, baseDir)) {
        files.set(relativeFile, content)
      }
      continue
    }

    files.set(relative(baseDir, fullPath), readFileSync(fullPath, 'utf8'))
  }

  return files
}

export function assertManagedSkillName(name: string): void {
  if (!/^[a-z0-9-]+$/u.test(name)) {
    throw new Error(`invalid skill name "${name}"; use lowercase letters, numbers, and hyphens`)
  }
}
