/* eslint-disable max-depth */
import { isRecord } from './_kit'
import {
  file,
  ref,
} from './refs'
import type { SeedDefinition } from './types'

export const SEED_PACKAGE = '@wisemen/payload-core-seeder'

const tokens = {
  file,
  ref,
}
const union = (values: string[]): string => (values.length > 0 ? values.map((v) => `'${v}'`).join(' | ') : 'never')

export function buildSeedRegistry(definitions: SeedDefinition[], packageName: string = SEED_PACKAGE): string {
  const collections: Record<string, string[]> = {}
  const globals: string[] = []

  for (const def of definitions) {
    if (def.kind === 'global') {
      globals.push(def.slug)
    }
    else if (def.kind === 'collection') {
      collections[def.slug] ??= []

      const keys = collections[def.slug]

      for (const rec of def.build(tokens)) {
        if (isRecord(rec) && typeof rec._key === 'string') {
          keys?.push(rec._key)
        }
      }
    }
  }

  const lines = [
    `declare module '${packageName}' {`,
    '  interface SeedRegistry {',
    '    collections: {',
  ]

  for (const slug of Object.keys(collections).sort()) {
    lines.push(`      '${slug}': ${union(collections[slug] ?? [].toSorted())}`)
  }

  lines.push('    }', `    globals: ${union(globals.toSorted())}`, '  }', '}')

  return lines.join('\n')
}
