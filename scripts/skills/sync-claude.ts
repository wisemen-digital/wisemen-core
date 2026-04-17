import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  CLAUDE_SKILLS_DIR,
  GENERATED_MARKER,
  collectFileMap,
  copyDirectory,
  ensureDirectory,
  listManagedSkills,
  parseArgs,
  relativePath,
  removeDirectory,
} from './shared.ts'

function buildExpectedMap(sourceDir: string): Map<string, string> {
  const expected = collectFileMap(sourceDir)
  expected.set(GENERATED_MARKER, 'Managed by scripts/skills/sync-claude.ts\n')
  return expected
}

function mapsEqual(left: Map<string, string>, right: Map<string, string>): boolean {
  if (left.size !== right.size) {
    return false
  }

  for (const [key, value] of left) {
    if (right.get(key) !== value) {
      return false
    }
  }

  return true
}

function syncSkill(sourceDir: string, destinationDir: string): void {
  removeDirectory(destinationDir)
  copyDirectory(sourceDir, destinationDir)
  writeFileSync(resolve(destinationDir, GENERATED_MARKER), 'Managed by scripts/skills/sync-claude.ts\n', 'utf8')
}

function main(): void {
  const args = parseArgs(process.argv.slice(2))
  const checkMode = args.check === true
  const sourceSkills = listManagedSkills()
  const seenDestinations = new Set<string>()
  const errors: string[] = []

  ensureDirectory(CLAUDE_SKILLS_DIR)

  for (const skill of sourceSkills) {
    const destinationDir = resolve(CLAUDE_SKILLS_DIR, skill.name)
    seenDestinations.add(destinationDir)

    if (checkMode) {
      const expected = buildExpectedMap(skill.dir)
      const actual = collectFileMap(destinationDir)

      if (!mapsEqual(expected, actual)) {
        errors.push(`${relativePath(destinationDir)} is out of sync with ${relativePath(skill.dir)}`)
      }

      continue
    }

    if (existsSync(destinationDir)) {
      const markerPath = resolve(destinationDir, GENERATED_MARKER)
      if (!existsSync(markerPath)) {
        throw new Error(`refusing to overwrite unmanaged Claude skill at ${relativePath(destinationDir)}`)
      }
    }

    syncSkill(skill.dir, destinationDir)
  }

  if (existsSync(CLAUDE_SKILLS_DIR)) {
    for (const entry of readdirSync(CLAUDE_SKILLS_DIR)) {
      const destinationDir = resolve(CLAUDE_SKILLS_DIR, entry)
      if (!statSync(destinationDir).isDirectory() || seenDestinations.has(destinationDir)) {
        continue
      }

      const markerPath = resolve(destinationDir, GENERATED_MARKER)
      if (!existsSync(markerPath)) {
        continue
      }

      if (checkMode) {
        errors.push(`${relativePath(destinationDir)} is stale and should be removed`)
      }
      else {
        removeDirectory(destinationDir)
      }
    }
  }

  if (errors.length > 0) {
    process.stderr.write(`${errors.join('\n')}\n`)
    process.exitCode = 1
    return
  }

  process.stdout.write(`${checkMode ? 'Checked' : 'Synced'} ${sourceSkills.length} Claude skill projection(s)\n`)
}

try {
  main()
}
catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}
