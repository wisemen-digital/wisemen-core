import { createSharedComposable } from '@vueuse/core'
import { useReducedMotion as useSystemReducedMotion } from 'motion-v'
import type { ComputedRef } from 'vue'
import {
  computed,
  toValue,
  watch,
} from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider/config.context'

export const useIsReducedMotion = createSharedComposable((reducedMotion?: ComputedRef<boolean>) => {
  const configContext = useInjectConfigContext(null)
  const systemReducedMotion = useSystemReducedMotion()

  const isReducedMotion = computed<boolean>(
    () => toValue(reducedMotion) === true
      || configContext?.reducedMotion.value === true
      || systemReducedMotion.value,
  )

  watch(isReducedMotion, (value) => {
    if (typeof document === 'undefined') {
      return
    }

    document.body.classList.toggle('reduced-motion', value)
  }, {
    immediate: true,
  })

  return isReducedMotion
})
