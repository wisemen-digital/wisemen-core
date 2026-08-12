import { Temporal } from 'temporal-polyfill'
import {
  beforeEach,
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
  ref,
} from 'vue'
import type { Ref } from 'vue'

import type { ActionGroup } from '@wisemen/vue-core-actions'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@wisemen/vue-core-design-system', () => ({
  useOverlay: () => ({
    create: () => ({
      close: vi.fn(),
      open: vi.fn(),
    }),
  }),
}))

vi.mock('@wisemen/vue-core-actions', () => ({
  createAction: (config: unknown) => config,
  useTemporaryActions: vi.fn(),
}))

const routeQueryRefs = new Map<string, Ref<string | null>>()

vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn((key: string, defaultValue: string | null = null) => {
    const existing = routeQueryRefs.get(key)

    if (existing) {
      return existing
    }

    const routeQueryRef = ref<string | null>(defaultValue)

    routeQueryRefs.set(key, routeQueryRef)

    return routeQueryRef
  }),
}))

import { useRouteQuery } from '@vueuse/router'

import type { Filter } from '@/composables/filters.composable'
import {
  createBooleanFilter,
  createDateFilter,
  DateFilterOperator,
  useFilters,
} from '@/composables/filters.composable'

const testActionGroup: ActionGroup = {
  name: () => 'Test',
  category: () => 'Test',
  priority: 1,
}

describe('useFilters', () => {
  beforeEach(() => {
    routeQueryRefs.clear()
    vi.clearAllMocks()
  })

  it('does not touch the URL when persistInUrl is not set', async () => {
    await mountFilters({
      actionGroup: testActionGroup,
      filters: [
        createBooleanFilter({
          key: 'isVerified',
          label: 'Verified',
          entityLabel: 'Contact',
        }),
      ],
    })

    expect(useRouteQuery).not.toHaveBeenCalled()
  })

  it('writes changes to the URL under the default key when persistInUrl is true', async () => {
    const { filters } = await mountFilters({
      actionGroup: testActionGroup,
      filters: [
        createBooleanFilter({
          key: 'isVerified',
          label: 'Verified',
          entityLabel: 'Contact',
        }),
      ],
      persistInUrl: true,
    })

    expect(useRouteQuery).toHaveBeenCalledWith('filters', null, {
      mode: 'replace',
    })

    filters.values.value.isVerified = true

    await nextTick()

    const persisted = JSON.parse(atob(routeQueryRefs.get('filters')!.value!))

    expect(persisted).toEqual({
      isVerified: true,
    })
  })

  it('uses a custom key when persistInUrl is a string', async () => {
    await mountFilters({
      actionGroup: testActionGroup,
      filters: [
        createBooleanFilter({
          key: 'isVerified',
          label: 'Verified',
          entityLabel: 'Contact',
        }),
      ],
      persistInUrl: 'my-filters',
    })

    expect(useRouteQuery).toHaveBeenCalledWith('my-filters', null, {
      mode: 'replace',
    })
  })

  it('restores values (including PlainDate values) from an existing URL query value', async () => {
    routeQueryRefs.set('filters', ref<string | null>(
      btoa(JSON.stringify({
        startDate: {
          operator: DateFilterOperator.IS,
          value: '2024-01-01',
        },
      })),
    ))

    const { filters } = await mountFilters({
      actionGroup: testActionGroup,
      filters: [
        createDateFilter({
          key: 'startDate',
          label: 'Start date',
        }),
      ],
      persistInUrl: true,
    })

    const startDate = filters.values.value.startDate

    expect(startDate.operator).toBe(DateFilterOperator.IS)
    expect(startDate.value).toBeInstanceOf(Temporal.PlainDate)
    expect(startDate.value?.toString()).toBe('2024-01-01')
  })
})

async function mountFilters<TFilters extends Filter[]>(
  options: Parameters<typeof useFilters<TFilters>>[0],
): Promise<{
  cleanup: () => void
  filters: ReturnType<typeof useFilters<TFilters>>
}> {
  let filters!: ReturnType<typeof useFilters<TFilters>>

  const TestComponent = defineComponent({
    setup() {
      filters = useFilters(options)

      return (): VNode => h('div')
    },
  })

  const app = createApp(TestComponent)
  const root = document.createElement('div')

  app.mount(root)

  await nextTick()

  return {
    cleanup: (): void => app.unmount(),
    filters,
  }
}
