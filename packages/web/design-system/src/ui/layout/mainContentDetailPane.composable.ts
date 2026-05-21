import type { Ref } from 'vue'
import {
  computed,
  ref,
  shallowRef,
} from 'vue'

import { useProvideMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'

export function useMainContentDetailPane() {
  const hasDetailPane = ref<boolean>(false)

  const detailPaneState = shallowRef<{
    isOpen: Ref<boolean>
    toggle: () => void
  } | null>(null)

  const detailPaneIsOpen = computed<boolean>(() => detailPaneState.value?.isOpen.value ?? false)

  function toggleDetailPane(): void {
    detailPaneState.value?.toggle()
  }

  function registerDetailPane(isOpen: Ref<boolean>, toggle: () => void): void {
    detailPaneState.value = {
      isOpen,
      toggle,
    }
    hasDetailPane.value = true
  }

  function unregisterDetailPane(): void {
    detailPaneState.value = null
    hasDetailPane.value = false
  }

  useProvideMainContentDetailPaneContext({
    hasDetailPane,
    isOpen: detailPaneIsOpen,
    registerDetailPane,
    toggle: toggleDetailPane,
    unregisterDetailPane,
  })
}
