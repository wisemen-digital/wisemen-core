import path from 'node:path'

import {
  agentsMdMergeHelpers,
  resolveAdapters,
} from './adapters/index.js'
import { discoverPackages } from './discover.js'
import type { FileChange } from './fs-utils.js'
import {
  deleteIfExists,
  listFilesRecursively,
  readIfExists,
  removeEmptyDirs,
  writeFileIfChanged,
} from './fs-utils.js'
import {
  buildLockfile,
  lockfilePath,
  readLockfile,
  serializeLockfile,
  serializeLockfileStable,
} from './lockfile.js'
import type {
  AdapterContext,
  DiscoveredPackage,
  ResolvedConfig,
} from './types.js'

export interface SyncResult {
  changes: FileChange[]
  packages: DiscoveredPackage[]
}

interface PlannedWrite {
  content: string
  path: string
}

async function planWrites(
  projectRoot: string,
  config: ResolvedConfig,
  packages: DiscoveredPackage[],
): Promise<PlannedWrite[]> {
  const context: AdapterContext = {
    config,
    packages,
    projectRoot,
  }
  const adapters = resolveAdapters(config.targets)
  const writes: PlannedWrite[] = []

  for (const adapter of adapters) {
    const rendered = await adapter.render(context)

    for (const file of rendered) {
      const absolutePath = path.isAbsolute(file.path)
        ? file.path
        : path.join(projectRoot, file.path)
      const content = adapter.name === 'agents-md'
        ? composeAgentsMd(absolutePath, file.content)
        : file.content

      writes.push({
        content,
        path: absolutePath,
      })
    }
  }

  return writes
}

function composeAgentsMd(absolutePath: string, newSection: string): string {
  const existing = readIfExists(absolutePath)
  const marker = agentsMdMergeHelpers.START_MARKER
  const sectionStart = newSection.indexOf(marker)

  if (sectionStart === -1) { return newSection }
  const section = newSection.slice(sectionStart)

  return agentsMdMergeHelpers.composeContent(existing, section)
}

function skillsOutputRoot(projectRoot: string, config: ResolvedConfig): string {
  const outDir = config.claude.outDir

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
  if (!config.targets.includes('claude')) { return }
  const root = skillsOutputRoot(projectRoot, config)
  const existing = listFilesRecursively(root)

  const deletedParents = new Set<string>()

  for (const file of existing) {
    if (keep.has(file)) { continue }
    if (!file.endsWith('.md')) { continue }
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

function reconcileLockfile(
  projectRoot: string,
  packages: DiscoveredPackage[],
  changes: FileChange[],
  options: { apply: boolean },
): void {
  const file = lockfilePath(projectRoot)
  const next = buildLockfile(packages)
  const existing = readLockfile(projectRoot)

  const nextStable = serializeLockfileStable(next)
  const existingStable = existing !== null ? serializeLockfileStable(existing) : null

  if (existingStable === nextStable) {
    changes.push({
      kind: 'unchanged',
      path: file,
    })

    return
  }
  if (options.apply) {
    changes.push(writeFileIfChanged(file, serializeLockfile(next)))
  }
  else {
    changes.push({
      kind: existing === null ? 'create' : 'update',
      path: file,
    })
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
  const writes = await planWrites(projectRoot, config, packages)
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
  reconcileLockfile(projectRoot, packages, changes, options)

  return {
    changes,
    packages,
  }
}
