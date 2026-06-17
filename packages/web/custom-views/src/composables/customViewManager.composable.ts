// oxlint-disable unicorn/consistent-function-scoping
import { useHotkey } from '@tanstack/vue-hotkeys'
import type { ActionGroup } from '@wisemen/vue-core-actions'
import { GroupPriority } from '@wisemen/vue-core-actions'
import {
  assert,
  StringUtil,
} from '@wisemen/vue-core-utils'
import {
  computed,
  shallowRef,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import { useProvideCustomViewManagerContext } from '@/context/customViewManager.context'
import type {
  CreateCustomViewMeta,
  CustomView,
  UpdateCustomViewMeta,
} from '@/types/customView.type'
import type {
  AdaptersToState,
  CustomViewStateAdapter,
} from '@/types/customViewStateAdapter.type'
import type { CustomViewStorageAdapter } from '@/types/customViewStorageAdapter.type'

interface Options<TAdapters extends CustomViewStateAdapter<string, any>[]> {
  seedViews: CustomView<AdaptersToState<TAdapters>>[]
  state: TAdapters
  storageAdapter: CustomViewStorageAdapter
}

export function useCustomViewManager<TAdapters extends CustomViewStateAdapter<string, any>[]>({
  seedViews,
  state,
  storageAdapter,
}: Options<TAdapters>) {
  type TState = AdaptersToState<TAdapters>

  const i18n = useI18n()
  const route = useRoute()
  const router = useRouter()

  const views = shallowRef<CustomView<TState>[]>(loadAndMergeViews())

  assert(views.value.length > 0, 'At least 1 view is required')

  const activeViewId = computed<string | null>(() => route.query.view as string | null ?? null)
  const workingState = computed<string | null>(() => route.query['view-state'] as string | null ?? null)

  const actionGroup: ActionGroup = {
    name: () => i18n.t('action.custom_view.group_name'),
    priority: GroupPriority.VIEW,
  }

  const activeView = computed<CustomView<TState>>(() => {
    return views.value.find((view) => view.id === activeViewId.value) ?? views.value[0]!
  })

  const currentAdapterState = computed<Record<string, unknown>>(() =>
    Object.fromEntries(state.map((a) => [
      a.key,
      a.getCurrentState(),
    ])))

  const isDirty = computed<boolean>(
    () => state.some((stateAdapter) => {
      const activeViewStateRaw = (activeView.value.state as Record<string, unknown>)[stateAdapter.key]

      const activeViewState = activeViewStateRaw == null
        ? null
        : stateAdapter.deserialize(activeViewStateRaw)

      return stateAdapter.isDirty(
        activeViewState,
        stateAdapter.getCurrentState(),
      )
    }),
  )

  function updateQuery(updates: Partial<Record<'view' | 'view-state', string | null>>): void {
    const query = {
      ...route.query,
    }

    let changed = false

    for (const [
      key,
      value,
    ] of Object.entries(updates)) {
      if (value == null) {
        if (key in query) {
          delete query[key]
          changed = true
        }
      }
      else if (query[key] !== value) {
        query[key] = value
        changed = true
      }
    }

    if (changed) {
      router.replace({
        ...route,
        query,
      })
    }
  }

  function viewAlreadyExists(view: CustomView, views: CustomView[]): boolean {
    return views.some((v) => v.id === view.id)
  }

  function loadAndMergeViews(): CustomView<TState>[] {
    const stored = storageAdapter.load() as CustomView<TState>[]

    return [
      ...seedViews.filter((view) => !viewAlreadyExists(view, stored)),
      ...stored,
    ]
  }

  function createView(viewMeta: CreateCustomViewMeta): void {
    const existingIds = new Set(views.value.map((v) => v.id))
    const slug = StringUtil.slugify(viewMeta.name)
    let id = slug
    let counter = 1

    while (existingIds.has(id)) {
      id = `${slug}-${counter}`
      counter++
    }
    const view: CustomView = {
      id,
      isEditable: true,
      name: viewMeta.name,
      color: viewMeta.color,
      icon: viewMeta.icon,
      state: captureState(),
    }

    views.value = [
      ...views.value,
      view,
    ]

    persist()
    setActiveView(id)
  }

  function saveToCurrentView(): void {
    const current = activeView.value

    if (!current.isEditable) {
      return
    }

    views.value = views.value.map((view) => view.id === current.id
      ? ({
          ...view,
          state: captureState(),
        })
      : view)

    persist()
    updateQuery({
      'view-state': null,
    })
  }

  function deleteView(viewId: string): void {
    if (activeViewId.value === viewId) {
      updateQuery({
        'view': null,
        'view-state': null,
      })
    }

    views.value = views.value.filter((view) => view.id !== viewId)
    persist()
  }

  function setActiveView(viewId: string): void {
    updateQuery({
      'view': viewId,
      'view-state': null,
    })
  }

  function updateViewMeta(viewId: string, meta: UpdateCustomViewMeta): void {
    views.value = views.value.map((v) => v.id === viewId
      ? ({
          ...v,
          ...meta,
        })
      : v)

    persist()
  }

  function revertToSavedView(): void {
    updateQuery({
      'view-state': null,
    })

    const view = activeView.value

    for (const stateAdapter of state) {
      const raw = (view.state as Record<string, unknown>)[stateAdapter.key]

      stateAdapter.apply(raw != null ? stateAdapter.deserialize(raw) : null)
    }
  }

  function reorderViews(orderedViews: CustomView<TState>[]): void {
    views.value = orderedViews
    persist()
  }

  function captureState(): AdaptersToState<TAdapters> {
    const stateObj: Record<string, unknown> = {}

    for (const adapter of state) {
      const current = adapter.getCurrentState()

      stateObj[adapter.key] = adapter.serialize(current)
    }

    return stateObj as AdaptersToState<TAdapters>
  }

  function persist(): void {
    storageAdapter.save(views.value)
  }

  function onActiveViewChange(view: CustomView): void {
    applyStateAdapters(view)
  }

  function applyStateAdapters(view: CustomView): void {
    for (const stateAdapter of state) {
      const activeViewStateRaw = (view.state as Record<string, unknown>)[stateAdapter.key]

      const activeViewState = activeViewStateRaw == null
        ? null
        : stateAdapter.deserialize(activeViewStateRaw)

      stateAdapter.apply(activeViewState)
    }

    if (workingState.value) {
      try {
        const rawWorking = JSON.parse(atob(workingState.value)) as Record<string, unknown>

        for (const stateAdapter of state) {
          // eslint-disable-next-line max-depth
          if (rawWorking[stateAdapter.key] !== undefined) {
            stateAdapter.apply(stateAdapter.deserialize(rawWorking[stateAdapter.key]))
          }
        }
      }
      catch {
        updateQuery({
          'view-state': null,
        })
      }
    }
  }

  watch(activeView, onActiveViewChange, {
    immediate: true,
  })

  watch(currentAdapterState, () => {
    updateQuery({
      'view-state': isDirty.value ? btoa(JSON.stringify(captureState())) : null,
    })
  }, {
    deep: true,
  })

  for (let i = 0; i < 9; i += 1) {
    // Azerty needs shift
    useHotkey({
      key: `${i + 1}`,
      shift: true,
    }, () => {
      const view = views.value[i] ?? null

      if (view !== null) {
        setActiveView(view.id)
      }
    }, {
      conflictBehavior: 'replace',
    })

    // Qwerty does not need shift
    useHotkey({
      key: `${i + 1}`,
    }, () => {
      const view = views.value[i] ?? null

      if (view !== null) {
        setActiveView(view.id)
      }
    }, {
      conflictBehavior: 'replace',
    })
  }

  const obj = {
    isDirty,
    actionGroup,
    activeView,
    createView,
    deleteView,
    reorderViews,
    revertToSavedView,
    saveToCurrentView,
    setActiveView,
    updateViewMeta,
    views: computed(() => views.value),
  }

  useProvideCustomViewManagerContext(obj)

  return obj
}
