import { createHash } from 'node:crypto'
import {
  existsSync,
  readFileSync,
} from 'node:fs'
import path from 'node:path'

import type {
  DiscoveredPackage,
  Lockfile,
  LockfileEntry,
} from './types.js'

const LOCKFILE_NAME = '.wisemen-skills.lock.json'

export function lockfilePath(projectRoot: string): string {
  return path.join(projectRoot, LOCKFILE_NAME)
}

export function readLockfile(projectRoot: string): Lockfile | null {
  const file = lockfilePath(projectRoot)

  if (!existsSync(file)) { return null }
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as Lockfile
  }
  catch {
    return null
  }
}

export function buildLockfile(packages: DiscoveredPackage[]): Lockfile {
  const entries: LockfileEntry[] = packages.map((pkg) => ({
    package: pkg.name,
    skills: pkg.skills.map((skill) => ({
      name: skill.skillName,
      checksum: checksum(skill.raw),
    })),
    version: pkg.version,
  }))

  return {
    generatedAt: new Date().toISOString(),
    entries,
    version: 1,
  }
}

export function checksum(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16)
}

export function serializeLockfile(lock: Lockfile): string {
  return `${JSON.stringify(lock, null, 2)}\n`
}

export function serializeLockfileStable(lock: Lockfile): string {
  const {
    entries, version,
  } = lock

  const stable = {
    entries,
    version,
  }

  return `${JSON.stringify(stable, null, 2)}\n`
}
