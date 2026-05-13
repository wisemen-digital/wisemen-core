import {
  useDebounceFn,
  useInfiniteScroll,
} from '@vueuse/core'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useActionPreview } from '#composables/actionPreview.composable.ts'
import { useActionManagerStore } from '#stores/actionManager.store.ts'
import type {
  Action,
  SubActionsWithMeta,
} from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import type { ActionModel } from '#types/actionModel.type.ts'
import {
  applicableActions,
  resolveSearchSubActionsConfig,
} from '#utils/resolveActions.util.ts'
import {
  isSubActionsWithMeta,
  resolveSubActions,
  storeSubActionsPagination,
} from '#utils/subActions.util.ts'

interface UseActionDropdownMenuContentOptions {
  actions: Ref<Action[]>
  metadata: Ref<Record<string, unknown> | undefined>
  models: Ref<ActionModel[]>
  parentAction: Ref<Action | null | undefined>
  scrollContainerRef: Ref<HTMLElement | null>
}

export function useActionDropdownMenuContent({
  actions,
  metadata,
  models,
  parentAction,
  scrollContainerRef,
}: UseActionDropdownMenuContentOptions) {
  const i18n = useI18n()
  const manager = useActionManagerStore()

  const highlightedActionId = ref<string | null>(null)
  const searchInput = ref<string>('')
  const debouncedSearchInput = ref<string>('')
  const areActionsResolvedWithSearchQuery = ref<boolean>(false)
  const resolvedActions = ref<Action[]>([])
  const subActionsMetaMap = ref<Record<string, number | null>>({})
  const isLoading = ref<boolean>(true)

  let refreshId = 0

  const context = computed<ActionContext>(() => manager.actionContext({
    menuType: 'contextualMenu',
    metadata: metadata.value as Record<string, unknown>,
    models: models.value,
    searchInput: debouncedSearchInput.value,
  }))

  const {
    preview,
    onHidePreview,
    onKeyDown,
    onShowPreview,
  } = useActionPreview({
    highlightedActionId,
    getContext: () => context.value,
    resolvedActions,
  })

  const placeholder = computed<string>(() => {
    if (parentAction.value == null) {
      return i18n.t('search')
    }

    const maybePlaceholderFn = resolveSearchSubActionsConfig(parentAction.value, context.value)?.placeholder

    if (maybePlaceholderFn === undefined) {
      return i18n.t('search')
    }

    if (typeof maybePlaceholderFn === 'function') {
      return maybePlaceholderFn()
    }

    return maybePlaceholderFn
  })

  async function refreshActions(): Promise<void> {
    const id = ++refreshId
    const ctx = context.value

    try {
      let sourceActions: Action[] = actions.value

      if (parentAction.value?.subActions !== undefined) {
        sourceActions = await resolveSubActions(parentAction.value, ctx, subActionsMetaMap.value)
      }

      const updatedActions = await applicableActions(sourceActions, ctx, (partial) => {
        if (id !== refreshId || partial.length === 0) {
          return
        }

        resolvedActions.value = partial
      }, parentAction.value ?? undefined)

      if (id !== refreshId) {
        return
      }

      resolvedActions.value = updatedActions
      areActionsResolvedWithSearchQuery.value = context.value.searchInput.trim().length > 0
    }
    catch (error) {
      console.error('Error refreshing actions', error)

      throw error
    }
    finally {
      if (id === refreshId) {
        isLoading.value = false
      }
    }
  }

  useInfiniteScroll(
    scrollContainerRef,
    async () => {
      const action = parentAction.value

      if (action?.subActions === undefined || action.id === undefined) {
        return
      }

      const storedOffset = subActionsMetaMap.value[action.id]

      if (storedOffset == null) {
        return
      }

      const ctxWithMeta = manager.actionContext({
        menuType: 'contextualMenu',
        metadata: metadata.value as Record<string, unknown>,
        models: models.value,
        searchInput: searchInput.value,
        subActionsMeta: {
          [action.id]: storedOffset,
        },
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
        const action = parentAction.value

        if (action?.subActions === undefined || action.id === undefined) {
          return false
        }

        return subActionsMetaMap.value[action.id] != null
      },
      distance: 100,
    },
  )

  const actionGroups = computed<Action[][]>(() => {
    const visibleActions = resolvedActions.value.filter((action) => {
      const applicable = action.isApplicable === undefined || action.isApplicable(context.value)
      const hasDisabledReason = action.disabledReason?.(context.value) != null

      return applicable || hasDisabledReason
    })

    if (areActionsResolvedWithSearchQuery.value) {
      return visibleActions.length > 0
        ? [
            visibleActions,
          ]
        : []
    }

    const groups: Action[][] = []
    let currentGroup: Action[] = []
    let currentSeparatorGroup: string | undefined

    for (const action of visibleActions) {
      if (currentGroup.length > 0 && action.separatorGroup !== currentSeparatorGroup) {
        groups.push(currentGroup)
        currentGroup = []
      }

      currentSeparatorGroup = action.separatorGroup
      currentGroup.push(action)
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  })

  const debouncedRefresh = useDebounceFn(() => {
    debouncedSearchInput.value = searchInput.value
    refreshActions()
  }, 200)

  watch(searchInput, () => {
    subActionsMetaMap.value = {}
    debouncedRefresh()
  })

  refreshActions()

  return {
    highlightedActionId,
    isLoading,
    actionGroups,
    context,
    placeholder,
    preview,
    searchInput,
    onHidePreview,
    onKeyDown,
    onShowPreview,
  }
}
