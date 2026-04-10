/* eslint-disable import-typescript/no-relative-parent-imports */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  after,
  describe,
  it
} from 'node:test'
import { fileURLToPath } from 'node:url'

import tsParser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'

import checkApiPropertyTypes from '../custom-rules/check-api-property-types.js'

const testDir = fileURLToPath(new URL('.', import.meta.url))
const packageRootDir = resolve(testDir, '..')
const fixturesDir = resolve(packageRootDir, 'test/fixtures/check-api-property-types')

RuleTester.afterAll = (callback) => {
  void after(callback)
}
RuleTester.describe = (text, callback) => {
  void describe(text, callback)
}
RuleTester.it = (text, callback) => {
  void it(text, callback)
}

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      projectService: true,
      tsconfigRootDir: packageRootDir
    }
  }
})

function getFixture (fixtureName: string) {
  const filename = resolve(fixturesDir, fixtureName)

  return {
    code: readFileSync(filename, 'utf8'),
    filename
  }
}

ruleTester.run('check-api-property-types', checkApiPropertyTypes, {
  valid: [
    getFixture('valid-branded-uuid.ts'),
    getFixture('valid-plain-string-uuid.ts'),
    getFixture('valid-nullable-required-array.ts')
  ],
  invalid: [
    {
      ...getFixture('invalid-missing-type.ts'),
      errors: [{ messageId: 'missingUuidType' }]
    },
    {
      ...getFixture('invalid-missing-format.ts'),
      errors: [{ messageId: 'missingUuidFormat' }]
    },
    {
      ...getFixture('invalid-string-literal-type.ts'),
      errors: [{ messageId: 'missingUuidType' }]
    },
    {
      ...getFixture('invalid-missing-both-imported-alias.ts'),
      errors: [{ messageId: 'missingUuidTypeAndFormat' }]
    }
  ]
})
