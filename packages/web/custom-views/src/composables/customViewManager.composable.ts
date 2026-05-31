// oxlint-disable unicorn/consistent-function-scoping
import { useHotkey } from '@tanstack/vue-hotkeys'
import { useRouteQuery } from '@vueuse/router'
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

  const views = shallowRef<CustomView<TState>[]>(loadAndMergeViews())

  assert(views.value.length > 0, 'At least 1 view is required')

  const activeViewId = useRouteQuery<string | null>('viewId', null)

  const actionGroup: ActionGroup = {
    name: () => i18n.t('action.custom_view.group_name'),
    priority: GroupPriority.VIEW,
  }

  const activeView = computed<CustomView<TState>>(() => {
    const result = views.value.find((view) => view.id === activeViewId.value) ?? null

    if (result !== null) {
      return result
    }

    const defaultView = views.value.find((view) => view.isDefault) ?? null

    return defaultView ?? views.value[0]!
  })

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
      isDefault: viewMeta.isDefault,
      isEditable: true,
      name: viewMeta.name,
      color: viewMeta.color,
      icon: viewMeta.icon,
      state: captureState(),
    }

    if (view.isDefault) {
      resolveDefaultView(id)
    }

    views.value = [
      ...views.value,
      view,
    ]

    persist()
    setActiveView(id)
  }

  function resolveDefaultView(defaultViewId: string): void {
    views.value = views.value.map((view) => ({
      ...view,
      isDefault: view.id === defaultViewId,
    }))
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
  }

  function deleteView(viewId: string): void {
    if (activeViewId.value === viewId) {
      activeViewId.value = null
    }

    views.value = views.value.filter((view) => view.id !== viewId)
    persist()
  }

  function setActiveView(viewId: string): void {
    activeViewId.value = viewId
  }

  function updateViewMeta(viewId: string, meta: UpdateCustomViewMeta): void {
    views.value = views.value.map((v) => v.id === viewId
      ? ({
          ...v,
          ...meta,
        })
      : v)

    if (meta.isDefault) {
      resolveDefaultView(viewId)
    }

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
  }

  watch(activeView, onActiveViewChange, {
    immediate: true,
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
      const view = sortViews(views.value)[i] ?? null

      if (view !== null) {
        setActiveView(view.id)
      }
    }, {
      conflictBehavior: 'replace',
    })
  }

  function sortViews(views: CustomView[]): CustomView[] {
    return views.toSorted((a, b) => Number(b.isDefault) - Number(a.isDefault))
  }

  const obj = {
    isDirty,
    actionGroup,
    activeView,
    createView,
    deleteView,
    saveToCurrentView,
    setActiveView,
    updateViewMeta,
    views: computed(() => sortViews(views.value)),
  }

  useProvideCustomViewManagerContext(obj)

  return obj
}
