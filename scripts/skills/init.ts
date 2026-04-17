import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  MANAGED_SKILLS_DIR,
  TEMPLATE_CONFIG,
  TEMPLATE_VERSION,
  assertManagedSkillName,
  ensureDirectory,
  parseArgs,
  readTemplate,
  renderTemplate,
  toTitleCase,
  writeTextFile,
} from './shared.ts'

function main(): void {
  const args = parseArgs(process.argv.slice(2))
  const template = args.template
  const name = args.name

  if (typeof template !== 'string' || !(template in TEMPLATE_CONFIG)) {
    throw new Error('expected --template <knowledge|workflow|scripted>')
  }

  if (typeof name !== 'string') {
    throw new Error('expected --name <skill-name>')
  }

  assertManagedSkillName(name)

  const skillDir = resolve(MANAGED_SKILLS_DIR, name)
  if (existsSync(skillDir)) {
    throw new Error(`skill already exists: ${skillDir}`)
  }

  const title = toTitleCase(name)
  const replacements = {
    skillName: name,
    description: `Describe the skill precisely. Use when the agent needs ${title.toLowerCase()}.`,
    title,
    displayName: title,
    shortDescription: `Summarize what ${title} does for the user.`,
    defaultPrompt: `Use this skill when working on ${title.toLowerCase()} in this repository.`,
    templateVersion: TEMPLATE_VERSION,
  }

  writeTextFile(
    resolve(skillDir, 'SKILL.md'),
    renderTemplate(readTemplate(template, 'SKILL.md.template.md'), replacements),
  )
  writeTextFile(
    resolve(skillDir, 'agents/openai.yaml'),
    renderTemplate(readTemplate(template, 'agents/openai.yaml.template'), replacements),
  )

  for (const resourceDir of TEMPLATE_CONFIG[template].resourceDirs) {
    ensureDirectory(resolve(skillDir, resourceDir))
    writeTextFile(resolve(skillDir, resourceDir, '.gitkeep'), '')
  }

  process.stdout.write(`Created managed skill at ${skillDir}\n`)
}

try {
  main()
}
catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}
