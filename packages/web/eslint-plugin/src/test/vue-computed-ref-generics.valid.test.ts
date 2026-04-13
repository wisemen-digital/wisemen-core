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

describe('vue-computed-ref-generics rule - valid cases', () => {
  it('should allow direct value return without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: 'const test = computed(() => value)',
        },
      ],
    })
  })

  it('should allow member expression without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: 'const test = computed(() => testValue.value)',
        },
      ],
    })
  })

  it('should allow function call without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: 'const test = computed(() => getValue())',
        },
      ],
    })
  })

  it('should allow block statement with function call without generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: `const test = computed(() => {
            return getValue()
          })`,
        },
      ],
    })
  })

  it('should allow object literal with generic type', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: 'const test = computed<TestType>(() => ({ a: 1, b: 2 }))',
        },
      ],
    })
  })

  it('should allow object literal in block statement with generic type', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: `const test = computed<TestType>(() => {
            return { a: 1, b: 2 }
          })`,
        },
      ],
    })
  })

  it('should allow array with generic', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: `const test = computed<TestType[]>(() => {
            return [{ a: 1 }]
          })`,
        },
      ],
    })
  })

  it('should allow ref with direct value', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: 'const test = ref(initialValue)',
        },
      ],
    })
  })

  it('should allow ref with generic and object literal', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: 'const test = ref<TestType>({ a: 1, b: 2 })',
        },
      ],
    })
  })

  it('should allow conditional with direct returns', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: `const test = computed(() => {
            if (condition) return getValue()
            return getDefault()
          })`,
        },
      ],
    })
  })

  it('should allow ref with generic and nested objects', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: `const test = ref<UserData>({
            user: { id: 1, name: 'test' },
            settings: { theme: 'dark' }
          })`,
        },
      ],
    })
  })

  it('should allow computed with generic and spread operator', () => {
    ruleTester.run('vue-computed-ref-generics', vueComputedRefGenericsRule, {
      invalid: [],
      valid: [
        {
          code: `const test = computed<Config>(() => ({
            ...baseConfig,
            debug: true
          }))`,
        },
      ],
    })
  })
})
