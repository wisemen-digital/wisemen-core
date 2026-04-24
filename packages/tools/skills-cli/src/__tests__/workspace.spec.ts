import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { findWorkspaceRoot } from '../workspace.js'

describe('findWorkspaceRoot', () => {
  let root = ''

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'wisemen-workspace-'))
  })
  afterEach(() => {
    if (root.length > 0) {
      rmSync(root, {
        force: true,
        recursive: true,
      })
    }
  })

  it('detects pnpm-workspace.yaml', () => {
    writeFileSync(path.join(root, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n')

    const subDir = path.join(root, 'apps', 'web', 'src')

    mkdirSync(subDir, {
      recursive: true,
    })

    expect(findWorkspaceRoot(subDir)).toBe(root)
  })

  it('detects npm/yarn workspaces in package.json', () => {
    writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({
        workspaces: [
          'packages/*',
        ],
      }),
    )

    const subDir = path.join(root, 'packages', 'lib')

    mkdirSync(subDir, {
      recursive: true,
    })

    expect(findWorkspaceRoot(subDir)).toBe(root)
  })

  it('returns starting dir when it is the workspace root', () => {
    writeFileSync(path.join(root, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n')

    expect(findWorkspaceRoot(root)).toBe(root)
  })

  it('returns null for standalone projects', () => {
    writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({
        name: 'standalone-app',
      }),
    )

    expect(findWorkspaceRoot(root)).toBeNull()
  })
})
