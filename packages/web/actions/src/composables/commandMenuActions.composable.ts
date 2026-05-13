import {
  useDebounceFn,
  useInfiniteScroll,
} from '@vueuse/core'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  shallowRef,
  watch,
} from 'vue'

import type { useActionManagerStore } from '#stores/actionManager.store.ts'
import type {
  Action,
  SubActionsWithMeta,
} from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import type { ActionModel } from '#types/actionModel.type.ts'
import type { NavFrame } from '#types/commandMenu.type.ts'
import { applicableActions } from '#utils/resolveActions.util.ts'
import {
  isSubActionsWithMeta,
  resolveSubActions,
  storeSubActionsPagination,
} from '#utils/subActions.util.ts'

interface UseCommandMenuActionsOptions {
  actionsSnapshot: Action[]
  focusedModelsSnapshot: ActionModel[]
  listboxContentRef: Ref<{ $el: HTMLElement } | null>
  listboxRootRef: Ref<{ highlightFirstItem: () => void } | null>
  manager: ReturnType<typeof useActionManagerStore>
  navStack: Ref<NavFrame[]>
  searchInput: Ref<string>
}

export function useCommandMenuActions({
  actionsSnapshot,
  focusedModelsSnapshot,
  listboxContentRef,
  listboxRootRef,
  manager,
  navStack,
  searchInput,
}: UseCommandMenuActionsOptions) {
  const isLoadingActions = ref(false)
  const isDebouncing = ref(false)
  const resolvedActions = shallowRef<Action[]>([])
  const subActionsMetaMap = ref<Record<string, number | null>>({})
  let refreshId = 0

  const scrollEl = computed<HTMLElement | undefined>(
    () => (listboxContentRef.value as any)?.$el as HTMLElement | undefined,
  )

  function buildContext(subActionsMeta?: Record<string, number | null>): ActionContext {
    return manager.actionContext({
      menuType: 'commandMenu',
      models: focusedModelsSnapshot,
      searchInput: searchInput.value,
      subActionsMeta,
    })
  }

  async function refreshActions(): Promise<void> {
    const id = ++refreshId

    isDebouncing.value = false
    isLoadingActions.value = true

    try {
      const ctx = buildContext()
      let sourceActions: Action[]

      if (navStack.value.length > 0) {
        const frame = navStack.value.at(-1)!

        if (frame.parentAction.subActions !== undefined) {
          sourceActions = await resolveSubActions(frame.parentAction, ctx, subActionsMetaMap.value)
        }
        else {
          sourceActions = frame.actions
        }
      }
      else {
        sourceActions = actionsSnapshot
      }

      const updatedActions = await applicableActions(sourceActions, ctx, (partial) => {
        if (id === refreshId && partial.length > 0) {
          resolvedActions.value = partial
        }
      }, navStack.value.at(-1)?.parentAction)

      if (id === refreshId) {
        resolvedActions.value = updatedActions
      }
    }
    catch (error) {
      console.error('Error refreshing actions', error)

      throw error
    }
    finally {
      if (id === refreshId) {
        isLoadingActions.value = false
      }
    }
  }

  const debouncedRefresh = useDebounceFn(refreshActions, 80)

  watch(searchInput, () => {
    subActionsMetaMap.value = {}
    isDebouncing.value = true

    const contentEl = (listboxContentRef.value as any)?.$el as HTMLElement | undefined

    contentEl?.scrollTo({
      behavior: 'instant',
      top: 0,
    })

    debouncedRefresh()
  })

  // After the action list changes, ensure a highlighted item always exists
  watch(resolvedActions, (updatedVal, oldVal) => {
    if (updatedVal.length === 0) {
      return
    }

    const listboxEl = (listboxRootRef.value as any)?.$el as HTMLElement | undefined

    // Timeout needed in case the parent frame is restored
    setTimeout(() => {
      const highlighted = listboxEl?.querySelector('[data-highlighted]') ?? null

      if (highlighted === null) {
        listboxRootRef.value?.highlightFirstItem()
      }
    })

    if (oldVal.length === 0) {
      setTimeout(() => {
        const contentEl = (listboxContentRef.value as any)?.$el as HTMLElement | undefined

        contentEl?.scrollTo({
          behavior: 'instant',
          top: 0,
        })
      })
    }
  })

  useInfiniteScroll(
    scrollEl,
    async () => {
      const action = navStack.value.at(-1)?.parentAction

      if (action?.subActions === undefined || action.id === undefined) {
        return
      }

      const storedOffset = subActionsMetaMap.value[action.id]

      if (storedOffset == null) {
        return
      }

      const ctxWithMeta = buildContext({
        [action.id]: storedOffset,
      })
      const raw = action.subActions(ctxWithMeta)
      let normalized: Action[] | SubActionsWithMeta

      if (Array.isArray(raw) || isSubActionsWithMeta(raw)) {
        normalized = raw
      }
      else if (raw instanceof Promise) {
        normalized = await raw
      }
      else {
        const items: Action[] = []

        for await (const item of raw) {
          items.push(item)
        }

        resolvedActions.value = [
          ...resolvedActions.value,
          ...items,
        ]

        return
      }

      resolvedActions.value = [
        ...resolvedActions.value,
        ...storeSubActionsPagination(action, normalized, subActionsMetaMap.value),
      ]
    },
    {
      canLoadMore: () => {
        const action = navStack.value.at(-1)?.parentAction

        if (action?.subActions === undefined || action.id === undefined) {
          return false
        }

        return subActionsMetaMap.value[action.id] != null
      },
      distance: 40,
    },
  )

  return {
    isDebouncing,
    isLoadingActions,
    buildContext,
    refreshActions,
    resolvedActions,
    subActionsMetaMap,
  }
}
