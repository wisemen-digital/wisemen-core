import { onBeforeUnmount } from 'vue'

import type { GroupPriority } from '#composables/actionGroup.composable'
import { useActionRegistryStore } from '#stores/actionRegistry.store.ts'
import type { Action } from '#types/action.type.ts'

export function useTemporaryActions(
  actions: Action | Action[],
  priority?: GroupPriority,
  controlled = false,
) {
  const registry = useActionRegistryStore()

  let registeredIds: number[] = []

  function register(): void {
    if (registeredIds.length > 0) {
      return
    }

    const actionsArray = Array.isArray(actions)
      ? actions
      : [
          actions,
        ]

    registeredIds = actionsArray.map((action) => registry.registerTemporaryAction(withPriority(action)))
  }

  function unregister(): void {
    for (const id of registeredIds) {
      registry.unregisterAction(id)
    }

    registeredIds = []
  }

  function withPriority(action: Action): Action {
    if (priority !== undefined) {
      return {
        ...action,
        group: {
          ...action.group,
          priority,
        },
      }
    }

    return action
  }

  if (!controlled) {
    register()

    onBeforeUnmount(() => {
      unregister()
    })
  }

  return {
    register,
    unregister,
  }
}
