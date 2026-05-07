/* eslint-disable check-file/filename-naming-convention */
import path from 'node:path'

import { discoverPackages } from './discover.js'
import type { FileChange } from './fs-utils.js'
import {
  deleteIfExists,
  listFilesRecursively,
  readIfExists,
  removeEmptyDirs,
  writeFileIfChanged,
} from './fs-utils.js'
import type {
  DiscoveredPackage,
  DiscoveredSkill,
  ResolvedConfig,
} from './types.js'

interface SyncResult {
  changes: FileChange[]
  packages: DiscoveredPackage[]
}

interface PlannedWrite {
  content: string
  path: string
}

function skillPath(outDir: string, skill: DiscoveredSkill): string {
  return path.posix.join(outDir, skill.packageShortName, skill.skillName, 'SKILL.md')
}

function planWrites(
  projectRoot: string,
  config: ResolvedConfig,
  packages: DiscoveredPackage[],
): PlannedWrite[] {
  const writes: PlannedWrite[] = []
  const outDir = '.agents/skills'

  for (const pkg of packages) {
    for (const skill of pkg.skills) {
      const skillOutPath = skillPath(outDir, skill)

      const absolutePath = path.isAbsolute(skillOutPath)
        ? skillOutPath
        : path.join(projectRoot, skillOutPath)

      writes.push({
        content: skill.raw.endsWith('\n') ? skill.raw : `${skill.raw}\n`,
        path: absolutePath,
      })
    }
  }

  return writes
}

function skillsOutputRoot(projectRoot: string): string {
  const outDir = '.agents/skills'

  return path.isAbsolute(outDir) ? outDir : path.join(projectRoot, outDir)
}

function collectExpectedPaths(writes: PlannedWrite[]): Set<string> {
  const paths = new Set<string>()

  for (const write of writes) {
    paths.add(write.path)
  }

  return paths
}

function cleanupStaleSkills(
  projectRoot: string,
  config: ResolvedConfig,
  keep: Set<string>,
  changes: FileChange[],
  options: { apply: boolean },
): void {
  const root = skillsOutputRoot(projectRoot)
  const existing = listFilesRecursively(root)

  const deletedParents = new Set<string>()

  for (const file of existing) {
    if (keep.has(file)) {
      continue
    }
    if (!file.endsWith('.md')) {
      continue
    }
    if (options.apply) {
      changes.push(deleteIfExists(file))
      deletedParents.add(path.dirname(file))
    }
    else {
      changes.push({
        kind: 'delete',
        path: file,
      })
    }
  }
  if (options.apply) {
    for (const dir of deletedParents) {
      removeEmptyDirs(dir, path.dirname(root))
    }
  }
}

export async function runSync(
  projectRoot: string,
  config: ResolvedConfig,
  options: { apply: boolean } = {
    apply: true,
  },
): Promise<SyncResult> {
  const packages = await discoverPackages(projectRoot, config)
  const writes = planWrites(projectRoot, config, packages)
  const changes: FileChange[] = []

  for (const write of writes) {
    if (options.apply) {
      changes.push(writeFileIfChanged(write.path, write.content))
    }
    else {
      const existing = readIfExists(write.path)

      if (existing === write.content) {
        changes.push({
          kind: 'unchanged',
          path: write.path,
        })
      }
      else {
        changes.push({
          kind: existing === null ? 'create' : 'update',
          path: write.path,
        })
      }
    }
  }

  const keep = collectExpectedPaths(writes)

  cleanupStaleSkills(projectRoot, config, keep, changes, options)

  return {
    changes,
    packages,
  }
}
