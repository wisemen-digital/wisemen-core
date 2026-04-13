/* eslint-disable check-file/filename-naming-convention */
/* eslint-disable test/expect-expect */
import tsParser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/utils/ts-eslint'
import {
  describe,
  it,
} from 'vitest'

import { vueComputedRefGenericsRule } from '../rules/vue-computed-ref-generics'

const ruleTester = new RuleTester({
  // @ts-expect-error - Some parsers may not attach typeParameters to the CallExpression,
  languageOptions: {
    ecmaVersion: 2020,
    parser: tsParser,
    sourceType: 'module',
  },
})

describe('vue-computed-ref-generics rule - invalid cases', () => {
  it('should error on object literal without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: 'const test = computed(() => ({ a: 1, b: 2 }))',
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })

  it('should error on object literal in block without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: `const test = computed(() => {
            return { a: 1, b: 2 }
          })`,
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })

  it('should error on array with object literal without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: `const test = computed(() => {
            return [{ a: 1 }]
          })`,
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })

  it('should error on method call without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: `const test = computed(() => {
            return [1, 2].map(item => ({ value: item }))
          })`,
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })

  it('should error on filter method returning objects without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: `const test = computed(() => {
            return items.filter(item => ({ ...item, active: true }))
          })`,
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })

  it('should error on nested object literal without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: `const test = computed(() => ({
            user: { id: 1, name: 'test' },
            settings: { theme: 'dark' }
          }))`,
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })

  it('should error on filter returning object without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [
        {
          code: `const test = computed(() => data.filter(x => ({ value: x })))`,
          errors: [
            {
              messageId: 'missingGeneric',
              data: {
                functionName: 'computed',
              },
            },
          ],
        },
      ],
      valid: [],
    })
  })
})
