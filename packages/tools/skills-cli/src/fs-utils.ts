/* eslint-disable check-file/filename-naming-convention */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

export interface FileChange {
  kind: 'create' | 'delete' | 'unchanged' | 'update'
  path: string
}

export function readIfExists(filePath: string): string | null {
  if (!existsSync(filePath)) {
    return null
  }
  if (!statSync(filePath).isFile()) {
    return null
  }

  return readFileSync(filePath, 'utf8')
}

export function ensureDir(dir: string): void {
  mkdirSync(dir, {
    recursive: true,
  })
}

export function writeFileIfChanged(filePath: string, content: string): FileChange {
  const existing = readIfExists(filePath)

  if (existing === content) {
    return {
      kind: 'unchanged',
      path: filePath,
    }
  }

  ensureDir(path.dirname(filePath))
  writeFileSync(filePath, content)

  return {
    kind: existing === null ? 'create' : 'update',
    path: filePath,
  }
}

export function deleteIfExists(filePath: string): FileChange {
  if (!existsSync(filePath)) {
    return {
      kind: 'unchanged',
      path: filePath,
    }
  }

  rmSync(filePath, {
    force: true,
  })

  return {
    kind: 'delete',
    path: filePath,
  }
}

export function listFilesRecursively(dir: string): string[] {
  if (!existsSync(dir)) {
    return []
  }
  const out: string[] = []
  // eslint-disable-next-line func-style
  const walk = (current: string): void => {
    for (const entry of readdirSync(current, {
      withFileTypes: true,
    })) {
      const full = path.join(current, entry.name)

      if (entry.isDirectory()) {
        walk(full)
      }
      else if (entry.isFile()) {
        out.push(full)
      }
    }
  }

  walk(dir)

  return out
}

export function removeEmptyDirs(dir: string, stopAt: string): void {
  let current = dir

  while (current.startsWith(stopAt) && current !== stopAt) {
    if (!existsSync(current)) {
      current = path.dirname(current)

      continue
    }
    const entries = readdirSync(current)

    if (entries.length > 0) {
      return
    }

    rmSync(current, {
      recursive: true,
    })
    current = path.dirname(current)
  }
}
