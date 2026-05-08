import { onBeforeUnmount } from 'vue'

import { useActionRegistryStore } from '#stores/actionRegistry.store.ts'
import type { Action } from '#types/action.type.ts'

export function useTemporaryActions(actions: Action | Action[]) {
  const registry = useActionRegistryStore()

  let registeredIds: number[] = []

  function register(): void {
    const actionsArray = Array.isArray(actions)
      ? actions
      : [
          actions,
        ]

    registeredIds = actionsArray.map((action) => registry.registerTemporaryAction(withViewPriority(action)))
  }

  function unregister(): void {
    for (const id of registeredIds) {
      registry.unregisterAction(id)
    }

    registeredIds = []
  }

  function withViewPriority(action: Action): Action {
    return {
      ...action,
      group: action.group
        ? {
            ...action.group,
            priority: -100,
          }
        : {
            name: 'View',
            priority: -100,
          },
    }
  }

  register()

  onBeforeUnmount(() => {
    unregister()
  })
}
