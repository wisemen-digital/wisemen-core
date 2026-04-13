import {
  assert,
  describe,
  it,
} from 'vitest'

describe('perfectionist plugin sorts correctly', () => {
  it('sorts classes', () => {
    class _TestClass {
      public static readonly test = 1
      private static readonly test2 = 2
      private readonly test3 = 3
      private test4: number = 4

      constructor() {
        this.test4 = 4
      }

      static test5(): number {
        return 5
      }

      private test6(): number {
        return 6
      }

      test7(): number {
        return 7
      }
    }

    assert(true)
  })

  it('sorts enums', () => {
    enum _TestEnum {
      test = 1,
      test2 = 2,
      test3 = 3,
    }

    assert(true)
  })

  it('sorts interfaces', () => {
    interface _TestInterface {
      id: number
      uuid: string
      testId: number
      title: string
      testedAt: Date
      testedOn: Date
      hasTest: boolean
      isTest: boolean
      test: number
      test2: number
      path: string
      component: string
      meta: Record<string, unknown>
      redirect: string
      children: string[]
      onTest: number
    }

    assert(true)
  })

  it('sorts types', () => {
    interface _TestType {
      id: number
      uuid: string
      testId: number
      title: string
      testedAt: Date
      testedOn: Date
      hasTest: boolean
      isTest: boolean
      test: number
      test2: number
      path: string
      component: string
      meta: Record<string, unknown>
      redirect: string
      children: string[]
      onTest: number
    }

    assert(true)
  })

  it('sorts objects', () => {
    const _TestObject = {
      id: 1,
      uuid: 3,
      testId: 2,
      title: 'title',
      testedAt: new Date(),
      testedOn: new Date(),
      hasTest: true,
      isTest: true,
      test: 3,
      test2: 4,
      path: 'path',
      component: 'component',
      meta: {
        meta: 'meta',
      },
      redirect: 'redirect',
      children: [
        'children',
      ],
      onTest: 5,
    }

    assert(true)
  })

  it('sorts union types', () => {
    type _TestUnionType = boolean | number | string | null | undefined

    assert(true)
  })
})
