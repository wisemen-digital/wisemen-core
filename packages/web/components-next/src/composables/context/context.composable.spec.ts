/* eslint-disable unicorn/consistent-function-scoping */
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import type { VNode } from 'vue'
import {
  createApp,
  defineComponent,
  h,
  nextTick,
} from 'vue'

import { useContext } from '@/composables/context/context.composable'

describe('useContext', () => {
  it('should allow providing and injecting context', async () => {
    const [
      useProvideContext,
      useInjectContext,
    ] = useContext<string>('TestContext')
    const testValue = 'test-value'

    let injectedValue: string | null = null
    const Child = defineComponent({
      setup() {
        injectedValue = useInjectContext()

        return (): VNode => h('span')
      },
    })

    const Parent = defineComponent({
      setup() {
        useProvideContext(testValue)

        return (): VNode => h('div', null, [
          h(Child),
        ])
      },
    })

    const {
      cleanup,
    } = await mountComponent(Parent)

    expect(injectedValue).toBe(testValue)

    cleanup()
  })

  it('should create distinct contexts for different names', async () => {
    const [
      useProvideContext1,
      useInjectContext1,
    ] = useContext<string>('Context1')
    const [
      useProvideContext2,
      useInjectContext2,
    ] = useContext<number>('Context2')

    const value1 = 'string-value'
    const value2 = 42

    let injectedValue1: string | null = null
    let injectedValue2: number | null = null

    const Child = defineComponent({
      setup() {
        injectedValue1 = useInjectContext1()
        injectedValue2 = useInjectContext2()

        return (): VNode => h('span')
      },
    })

    const Parent = defineComponent({
      setup() {
        useProvideContext1(value1)
        useProvideContext2(value2)

        return (): VNode => h('div', null, [
          h(Child),
        ])
      },
    })

    const {
      cleanup,
    } = await mountComponent(Parent)

    expect(injectedValue1).toBe(value1)
    expect(injectedValue2).toBe(value2)

    cleanup()
  })

  it('should use fallback value when context is not provided', async () => {
    const [
      ,
      useInjectContext,
    ] = useContext<string>('TestContext')
    const fallbackValue = 'fallback-value'

    let result: string | null = null
    const component = defineComponent({
      setup() {
        result = useInjectContext(fallbackValue)

        return (): VNode => h('span')
      },
    })

    const {
      cleanup,
    } = await mountComponent(component)

    expect(result).toBe(fallbackValue)

    cleanup()
  })

  it('should throw error when context is not provided and no fallback is given', async () => {
    const [
      , useInjectContext,
    ] = useContext<string>('ErrorContext')

    let errorThrown = false
    const TestComponent = defineComponent({
      setup() {
        try {
          useInjectContext()
        }
        catch (error) {
          if (error instanceof Error
            && error.message === 'ErrorContext context is not provided.') {
            errorThrown = true
          }
          else {
            throw error
          }
        }

        return (): VNode => h('div')
      },
    })

    const {
      cleanup,
    } = await mountComponent(TestComponent)

    expect(errorThrown).toBeTruthy()

    cleanup()
  })
  it('should handle nested context providers', async () => {
    const [
      useProvideContext,
      useInjectContext,
    ] = useContext<string>('NestedContext')
    const parentValue = 'parent-value'
    const childValue = 'child-value'

    let middleInjectedValue: string | null = null
    let childInjectedValue: string | null = null

    const GrandChild = defineComponent({
      setup() {
        childInjectedValue = useInjectContext()

        return (): VNode => h('span')
      },
    })

    const ChildProvider = defineComponent({
      setup() {
        useProvideContext(childValue)

        return (): VNode => h('div', null, [
          h(GrandChild),
        ])
      },
    })

    const MiddleComponent = defineComponent({
      setup() {
        middleInjectedValue = useInjectContext()

        return (): VNode => h('div', null, [
          h(ChildProvider),
        ])
      },
    })

    const Parent = defineComponent({
      setup() {
        useProvideContext(parentValue)

        return (): VNode => h('div', null, [
          h(MiddleComponent),
        ])
      },
    })

    const {
      cleanup,
    } = await mountComponent(Parent)

    expect(middleInjectedValue).toBe(parentValue)
    expect(childInjectedValue).toBe(childValue)

    cleanup()
  })
})

async function mountComponent(component: any): Promise<{
  app: ReturnType<typeof createApp>
  cleanup: () => void
}> {
  const originalError = console.error

  console.error = vi.fn()

  const app = createApp(component)
  const root = document.createElement('div')

  app.mount(root)

  await nextTick()

  return {
    app,
    cleanup: (): void => {
      app.unmount()
      console.error = originalError
    },
  }
}
