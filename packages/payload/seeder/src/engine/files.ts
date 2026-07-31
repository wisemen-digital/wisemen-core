import { readFile } from 'node:fs/promises'
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
} from 'node:path'

import type { File } from 'payload'

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const TOLERANT_EXTS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.gif',
  '.svg',
])

const stripExt = (name: string) => name.slice(0, name.length - extname(name).length)

export function searchedDirs(name: string, assetsRoot: string, subdirs: string[]): string[] {
  return subdirs.map((sub) => join(assetsRoot, sub, dirname(name)))
}

export async function resolveFilePath(name: string, assetsRoot: string, subdirs: string[]): Promise<string | null> {
  if (isAbsolute(name)) {
    return name
  }
  const {
    readdir,
  } = await import('node:fs/promises')
  const nameDir = dirname(name)
  const fileName = basename(name)
  const wantBase = stripExt(fileName)

  for (const sub of subdirs) {
    const dir = join(assetsRoot, sub, nameDir)
    let entries: string[]

    try {
      entries = await readdir(dir)
    }
    catch {
      continue
    }
    if (entries.includes(fileName)) {
      return join(dir, fileName)
    }
    const sibling = entries.find((e) => stripExt(e) === wantBase && TOLERANT_EXTS.has(extname(e).toLowerCase()))

    if (sibling) {
      return join(dir, sibling)
    }
  }

  return null
}

export async function readFileAsUpload(path: string): Promise<File> {
  const data = await readFile(path)
  const name = path.split(/[\\/]/).pop() ?? path
  const mimetype = MIME_BY_EXT[extname(path).toLowerCase()] ?? 'application/octet-stream'

  return {
    name,
    data,
    mimetype,
    size: data.byteLength,
  }
}
