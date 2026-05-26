import type { ComputedRef } from 'vue'
import {
  onBeforeUnmount,
  watch,
} from 'vue'

import { useActionManagerStore } from '#stores/actionManager.store.ts'
import type { ActionModel } from '#types/actionModel.type.ts'

export function useActiveModels(
  models: ComputedRef<ActionModel[]>,
  type: 'focused' | 'view',
) {
  const manager = useActionManagerStore()

  function register(): void {
    if (type === 'focused') {
      manager.setFocusedModels([
        ...manager.focusedModels,
        ...models.value,
      ])
    }
    else {
      manager.setViewModels([
        ...manager.viewModels,
        ...models.value,
      ])
    }
  }

  function unregister(): void {
    if (type === 'focused') {
      manager.setFocusedModels(
        manager.focusedModels.filter(
          (vm) => !models.value.some((m) => m.key === vm.key),
        ),
      )
    }
    else {
      manager.setViewModels(
        manager.viewModels.filter(
          (vm) => !models.value.some((m) => m.key === vm.key),
        ),
      )
    }
  }

  watch(models, () => {
    unregister()
    register()
  })

  register()

  onBeforeUnmount(() => {
    unregister()
  })
}
