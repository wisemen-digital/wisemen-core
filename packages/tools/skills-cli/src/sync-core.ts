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

interface PlannedCopy {
  dstPath: string
  srcPath: string
}

function skillOutputDir(projectRoot: string, skill: DiscoveredSkill): string {
  const outDir = path.join(projectRoot, '.agents/skills')

  const packageName = skill.packageName.replace('@', '').replace('/', '-')

  return path.join(outDir, `packages@${packageName}@${skill.skillName}`)
}

function planCopies(projectRoot: string, packages: DiscoveredPackage[]): PlannedCopy[] {
  const copies: PlannedCopy[] = []

  for (const pkg of packages) {
    for (const skill of pkg.skills) {
      const destSkillDir = skillOutputDir(projectRoot, skill)
      const srcFiles = listFilesRecursively(skill.skillDir)

      for (const srcFile of srcFiles) {
        const relPath = path.relative(skill.skillDir, srcFile)

        copies.push({
          dstPath: path.join(destSkillDir, relPath),
          srcPath: srcFile,
        })
      }
    }
  }

  return copies
}

function skillsOutputRoot(projectRoot: string): string {
  const outDir = '.agents/skills'

  return path.isAbsolute(outDir) ? outDir : path.join(projectRoot, outDir)
}

function collectExpectedPaths(copies: PlannedCopy[]): Set<string> {
  const paths = new Set<string>()

  for (const copy of copies) {
    paths.add(copy.dstPath)
  }

  return paths
}

function cleanupStaleSkills(
  projectRoot: string,
  keep: Set<string>,
  changes: FileChange[],
  options: { apply: boolean },
): void {
  const root = skillsOutputRoot(projectRoot)
  const existing = listFilesRecursively(root)

  const deletedParents = new Set<string>()

  const prefix = path.join(root, 'packages@')

  for (const file of existing) {
    if (!file.startsWith(prefix)) {
      continue
    }
    if (keep.has(file)) {
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
  const copies = planCopies(projectRoot, packages)
  const changes: FileChange[] = []

  for (const copy of copies) {
    if (options.apply) {
      const content = readIfExists(copy.srcPath) ?? ''

      changes.push(writeFileIfChanged(copy.dstPath, content))
    }
    else {
      const src = readIfExists(copy.srcPath) ?? ''
      const existing = readIfExists(copy.dstPath)

      let kind: FileChange['kind']

      if (existing === null) {
        kind = 'create'
      }
      else if (existing === src) {
        kind = 'unchanged'
      }
      else {
        kind = 'update'
      }

      changes.push({
        kind,
        path: copy.dstPath,
      })
    }
  }

  const keep = collectExpectedPaths(copies)

  cleanupStaleSkills(projectRoot, keep, changes, options)

  return {
    changes,
    packages,
  }
}
