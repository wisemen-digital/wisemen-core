import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import type { TypesenseModuleOptions } from '../typesense.module-options.js'
import { TypesenseCollections } from './typesense-collections.js'

describe('TypesenseCollections', () => {
  it('loads exported collections from the configured module glob', async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), 'typesense-collections-'))
    const fixturePath = join(tempDirectory, 'contacts.typesense-collection.js')
    const typesenseModulePath = pathToFileURL(resolve(process.cwd(), 'dist', 'index.js')).href

    writeFileSync(
      fixturePath,
      [
        `import { Typesense } from ${JSON.stringify(typesenseModulePath)}`,
        'export const contacts = Typesense.collection("contacts", {',
        '  id: Typesense.string(),',
        '  email: Typesense.string().optional()',
        '})'
      ].join('\n')
    )

    try {
      const collections = new TypesenseCollections({
        collectionsGlob: fixturePath
      } as TypesenseModuleOptions)

      await collections.onApplicationBootstrap()

      expect(Object.keys(collections.get('contacts'))).toEqual(['id', 'email'])
    } finally {
      rmSync(tempDirectory, { force: true, recursive: true })
    }
  })
})
