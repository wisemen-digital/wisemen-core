import { onBeforeUnmount } from 'vue'

import type { GroupPriority } from '#composables/actionGroup.composable'
import { useActionRegistryStore } from '#stores/actionRegistry.store.ts'
import type { Action } from '#types/action.type.ts'

export function useTemporaryActions(
  actions: Action | Action[],
  priority: GroupPriority,
  controlled = false,
) {
  const registry = useActionRegistryStore()

  let registeredIds: number[] = []

  function register(): void {
    const actionsArray = Array.isArray(actions)
      ? actions
      : [
          actions,
        ]

    registeredIds = actionsArray.map((action) => registry.registerTemporaryAction(withCustomPriority(action)))
  }

  function unregister(): void {
    for (const id of registeredIds) {
      registry.unregisterAction(id)
    }

    registeredIds = []
  }

  function withCustomPriority(action: Action): Action {
    return {
      ...action,
      group: action.group
        ? {
            ...action.group,
            priority,
          }
        : {
            name: 'View/Hover',
            priority,
          },
    }
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
