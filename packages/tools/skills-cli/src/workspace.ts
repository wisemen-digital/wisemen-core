import {
  existsSync,
  readFileSync,
} from 'node:fs'
import path from 'node:path'

function isWorkspaceRoot(dir: string): boolean {
  if (existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
    return true
  }

  const pkgPath = path.join(dir, 'package.json')

  if (!existsSync(pkgPath)) {
    return false
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>

    return Array.isArray(pkg.workspaces)
      || (typeof pkg.workspaces === 'object' && pkg.workspaces !== null)
  }
  catch {
    return false
  }
}

export function findWorkspaceRoot(startDir: string): string | null {
  let dir = path.resolve(startDir)

  // eslint-disable-next-line ts/no-unnecessary-condition
  while (true) {
    if (isWorkspaceRoot(dir)) {
      return dir
    }

    const parent = path.dirname(dir)

    if (parent === dir) {
      break
    }

    dir = parent
  }

  return null
}
