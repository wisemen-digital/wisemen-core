import type {
  Ref,
  ShallowRef,
} from 'vue'
import { computed } from 'vue'

import type { useActionManagerStore } from '#stores/actionManager.store.ts'
import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import type { NavFrame } from '#types/commandMenu.type.ts'
import {
  resolveActionName,
  resolveActionValue,
  resolveSearchSubActionsConfig,
} from '#utils/resolveActions.util.ts'

interface UseCommandMenuNavigationOptions {
  isShiftKeyHeld: Ref<boolean>
  buildContext: () => ActionContext
  emit: (event: 'close') => void
  listboxRootRef: Ref<{ highlightItem: (id: string | undefined) => void } | null>
  manager: ReturnType<typeof useActionManagerStore>
  navStack: Ref<NavFrame[]>
  refreshActions: () => Promise<void>
  resolvedActions: ShallowRef<Action[]>
  scrollToTopOfGroup: () => void
  searchInput: Ref<string>
  subActionsMetaMap: Ref<Record<string, number | null>>
}

export function useCommandMenuNavigation({
  isShiftKeyHeld,
  buildContext,
  emit,
  listboxRootRef,
  manager,
  navStack,
  refreshActions,
  resolvedActions,
  scrollToTopOfGroup,
  searchInput,
  subActionsMetaMap,
}: UseCommandMenuNavigationOptions) {
  const currentParent = computed<Action | null>(
    () => navStack.value.at(-1)?.parentAction ?? null,
  )

  const breadcrumbs = computed<string[]>(() => {
    const ctx = buildContext()

    return navStack.value
      .filter((e) => e.parentAction.forceAsRootMenu !== true)
      .map((frame) => {
        const a = frame.parentAction

        if (a.nameAsParent !== undefined) {
          return typeof a.nameAsParent === 'function' ? a.nameAsParent(ctx) : a.nameAsParent
        }

        return resolveActionValue(a.name, ctx)
      })
  })

  const placeholder = computed<string>(() => {
    if (currentParent.value === null) {
      return 'Type a command or search...'
    }

    const maybePlaceholderFn = resolveSearchSubActionsConfig(currentParent.value, buildContext())?.placeholder

    if (maybePlaceholderFn === undefined) {
      return 'Search...'
    }

    if (typeof maybePlaceholderFn === 'function') {
      return maybePlaceholderFn()
    }

    return maybePlaceholderFn
  })

  async function activateAction(action: Action): Promise<void> {
    const ctx = buildContext()

    if (action.disabledReason?.(ctx)) {
      return
    }

    if (action.execute !== undefined) {
      void manager.executeAction(action, ctx)

      const multiSelectSubActions = currentParent.value?.multiSelectSubActions ?? false

      if (!multiSelectSubActions || !isShiftKeyHeld.value) {
        emit('close')
      }

      return
    }

    if (action.subActions !== undefined) {
      navStack.value.push({
        actions: [],
        parentAction: action,
        savedActiveAction: action,
        savedResolvedActions: resolvedActions.value,
        savedSearchInput: searchInput.value,
      })

      subActionsMetaMap.value = {}
      searchInput.value = ''
      resolvedActions.value = []

      await refreshActions()
    }
  }

  async function restoreParentFrame(): Promise<void> {
    const popped = navStack.value.pop() ?? null

    if (popped === null) {
      return
    }

    searchInput.value = popped.savedSearchInput
    resolvedActions.value = popped.savedResolvedActions

    await refreshActions()

    if (popped.savedActiveAction !== null) {
      listboxRootRef.value?.highlightItem(popped.savedActiveAction.id)
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (
      event.key === 'Backspace'
      && !event.repeat
      && searchInput.value === ''
      && navStack.value.length > 0
    ) {
      event.preventDefault()
      restoreParentFrame()
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      scrollToTopOfGroup()
    }
  }

  return {
    activateAction,
    breadcrumbs,
    currentParent,
    placeholder,
    restoreParentFrame,
    onKeyDown,
  }
}

export function resolveActionBreadcrumbs(
  action: Action,
  ctx: ActionContext,
): {
  icon: ReturnType<NonNullable<Action['icon']>> | null
  label: string
}[] {
  const parts: {
    icon: ReturnType<NonNullable<Action['icon']>> | null
    label: string
  }[] = []

  let current = action.parentAction ?? null

  while (current !== null) {
    if (current.forceAsRootMenu === true) {
      return parts
    }

    const label = current.nameAsParent !== undefined
      ? resolveActionValue(current.nameAsParent, ctx)
      : resolveActionName(current, ctx)

    parts.unshift({
      icon: current.icon?.(ctx) ?? null,
      label,
    })
    current = current.parentAction ?? null
  }

  return parts.slice(-1)
}
