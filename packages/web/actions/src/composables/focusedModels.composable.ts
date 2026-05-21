import type { ComputedRef } from 'vue'
import {
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'

import { useActionManagerStore } from '#stores/actionManager.store.ts'
import type { ActionModel } from '#types/actionModel.type.ts'

export function useFocusedModels(models: ComputedRef<ActionModel[]>) {
  const manager = useActionManagerStore()
  const isActive = ref(false)

  function register(): void {
    isActive.value = true
    manager.setFocusedModels([
      ...manager.focusedModels,
      ...models.value,
    ])
  }

  function unregister(): void {
    isActive.value = false
    manager.setFocusedModels(
      manager.focusedModels.filter(
        (vm) => !models.value.some((m) => m.key === vm.key),
      ),
    )
  }

  watch(models, (_, oldModels) => {
    if (!isActive.value) {
      return
    }

    manager.setFocusedModels([
      ...manager.focusedModels.filter(
        (vm) => !oldModels.some((m) => m.key === vm.key),
      ),
      ...models.value,
    ])
  })

  onBeforeUnmount(() => {
    unregister()
  })

  return {
    register,
    unregister,
  }
}
