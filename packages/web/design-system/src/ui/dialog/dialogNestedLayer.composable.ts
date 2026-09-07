import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'

import { useInjectDialogContext } from '@/ui/dialog/dialog.context'

/**
 * Registers a popover-family layer (Popover, Autocomplete, ...) with its
 * ancestor Dialog, if any, so the Dialog can defer outside-click dismissal
 * to this layer while it's open. No-op when not nested inside a Dialog.
 */
export function useRegisterAsDialogNestedLayer(isOpen: Ref<boolean>): void {
  const dialogContext = useInjectDialogContext(null)

  watch(isOpen, (isOpenValue, wasOpen) => {
    if (isOpenValue) {
      dialogContext?.registerNestedLayer()
    }
    else if (wasOpen) {
      dialogContext?.unregisterNestedLayer()
    }
  })

  onBeforeUnmount(() => {
    if (isOpen.value) {
      dialogContext?.unregisterNestedLayer()
    }
  })
}

/**
 * Owned by a Dialog to track how many popover-family layers registered via
 * `useRegisterAsDialogNestedLayer` are currently open inside it, so it can
 * defer its own outside-click dismissal while any of them are open.
 */
export function useDialogNestedLayerCount(): {
  hasOpenNestedLayer: ComputedRef<boolean>
  registerNestedLayer: () => void
  unregisterNestedLayer: () => void
} {
  const openNestedLayerCount = ref<number>(0)
  const hasOpenNestedLayer = computed<boolean>(() => openNestedLayerCount.value > 0)

  function registerNestedLayer(): void {
    openNestedLayerCount.value += 1
  }

  function unregisterNestedLayer(): void {
    openNestedLayerCount.value -= 1
  }

  return {
    hasOpenNestedLayer,
    registerNestedLayer,
    unregisterNestedLayer,
  }
}
