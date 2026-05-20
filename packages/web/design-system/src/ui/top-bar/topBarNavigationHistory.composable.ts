import {
  computed,
  ref,
} from 'vue'
import type { HistoryState } from 'vue-router'
import { useRouter } from 'vue-router'

export function useTopBarNavigationHistory() {
  const router = useRouter()
  const state = ref<HistoryState>(router.options.history.state)

  const canGoBack = computed<boolean>(() => state.value.back !== null)
  const canGoForward = computed<boolean>(() => state.value.forward !== null)

  router.afterEach(() => {
    state.value = router.options.history.state
  })

  function goBack(): void {
    if (canGoBack.value) {
      router.back()
    }
  }

  function goForward(): void {
    if (canGoForward.value) {
      router.forward()
    }
  }

  return {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
  }
}
