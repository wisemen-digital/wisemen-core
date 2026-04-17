import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import {
  TEMPLATE_CONFIG,
  TEMPLATE_VERSION,
  extractBody,
  getMarkdownLinks,
  getTemplateMarker,
  isExternalLink,
  lineCount,
  listManagedSkills,
  parseFrontmatter,
  readOpenAiYaml,
  readText,
  relativePath,
} from './shared.ts'

const MAX_SKILL_LINES = 500

function validateSkill(dir: string): string[] {
  const errors: string[] = []
  const skillPath = resolve(dir, 'SKILL.md')
  const markdown = readText(skillPath)

  let frontmatter
  try {
    frontmatter = parseFrontmatter(markdown)
  }
  catch (error) {
    return [`${relativePath(skillPath)}: ${error instanceof Error ? error.message : String(error)}`]
  }

  if (frontmatter.extraKeys.length > 0) {
    errors.push(`${relativePath(skillPath)}: frontmatter may only contain name and description`)
  }

  if (!frontmatter.description.includes('Use when')) {
    errors.push(`${relativePath(skillPath)}: description must include "Use when"`)
  }

  if (frontmatter.description.length < 40) {
    errors.push(`${relativePath(skillPath)}: description is too short`)
  }

  if (lineCount(markdown) > MAX_SKILL_LINES) {
    errors.push(`${relativePath(skillPath)}: SKILL.md exceeds ${MAX_SKILL_LINES} lines`)
  }

  const body = extractBody(markdown)
  const marker = getTemplateMarker(body)

  if (!marker) {
    errors.push(`${relativePath(skillPath)}: missing template marker comment`)
    return errors
  }

  if (marker.version !== TEMPLATE_VERSION) {
    errors.push(`${relativePath(skillPath)}: unsupported template version ${marker.version}`)
  }

  for (const heading of TEMPLATE_CONFIG[marker.templateId].headings) {
    if (!body.includes(heading)) {
      errors.push(`${relativePath(skillPath)}: missing required heading "${heading}"`)
    }
  }

  const openAiYamlPath = resolve(dir, 'agents/openai.yaml')
  if (!existsSync(openAiYamlPath)) {
    errors.push(`${relativePath(openAiYamlPath)}: missing required file`)
  }
  else {
    let openAiYaml: Record<string, string>

    try {
      openAiYaml = readOpenAiYaml(openAiYamlPath)
    }
    catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
      openAiYaml = {}
    }

    for (const key of ['display_name', 'short_description', 'default_prompt']) {
      if (!openAiYaml[key]) {
        errors.push(`${relativePath(openAiYamlPath)}: missing required key "${key}"`)
      }
    }
  }

  for (const link of getMarkdownLinks(markdown)) {
    if (isExternalLink(link)) {
      continue
    }

    const [cleanTarget] = link.split('#')
    if (!cleanTarget) {
      continue
    }

    const targetPath = resolve(dirname(skillPath), cleanTarget)
    if (!existsSync(targetPath)) {
      errors.push(`${relativePath(skillPath)}: linked file does not exist: ${link}`)
    }
  }

  return errors
}

function main(): void {
  const allErrors = listManagedSkills().flatMap(({ dir }) => validateSkill(dir))

  if (allErrors.length > 0) {
    process.stderr.write(`${allErrors.join('\n')}\n`)
    process.exitCode = 1
    return
  }

  process.stdout.write(`Validated ${listManagedSkills().length} managed skill(s)\n`)
}

main()
