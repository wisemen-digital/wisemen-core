import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'
import { expect } from 'expect'

/**
 * Collect dependencies from the emitted import graph. This verifies that optional peers are not
 * reachable through an entrypoint even when they are installed in the workspace.
 */
async function collectBareSpecifiers (entrypoint: URL): Promise<Set<string>> {
  const seen = new Set<string>()
  const bare = new Set<string>()
  const queue = [entrypoint]

  while (queue.length > 0) {
    const current = queue.pop() as URL

    if (seen.has(current.href)) continue
    seen.add(current.href)

    const source = await readFile(current, 'utf8')
    const specifiers = [...source.matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g)]
      .map(match => match[1])

    for (const specifier of specifiers) {
      if (specifier.startsWith('.')) {
        queue.push(new URL(specifier, current))
      } else {
        bare.add(specifier)
      }
    }
  }

  return bare
}

const root = new URL('./index.js', import.meta.url)
const testing = new URL('./testing/index.js', import.meta.url)
const fcm = new URL('./fcm/index.js', import.meta.url)

describe('export boundary', () => {
  it('never reaches firebase-admin from the root export', async () => {
    const specifiers = await collectBareSpecifiers(root)

    expect([...specifiers].filter(name => name.includes('firebase'))).toEqual([])
  })

  it('never reaches firebase-admin from the testing export', async () => {
    const specifiers = await collectBareSpecifiers(testing)

    expect([...specifiers].filter(name => name.includes('firebase'))).toEqual([])
  })

  it('detects firebase-admin when it is genuinely reachable', async () => {
    // Positive control for the import graph walk.
    const specifiers = await collectBareSpecifiers(fcm)

    expect([...specifiers].some(name => name.includes('firebase'))).toBe(true)
  })

  it('keeps the root export free of undeclared runtime dependencies', async () => {
    const specifiers = await collectBareSpecifiers(root)
    const allowed = new Set(['@nestjs/common', '@wisemen/nestjs-typeorm', 'typeorm', 'node:crypto'])

    expect([...specifiers].filter(name => !allowed.has(name))).toEqual([])
  })
})
