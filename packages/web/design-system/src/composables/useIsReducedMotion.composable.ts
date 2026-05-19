import { useReducedMotion as useSystemReducedMotion } from 'motion-v'
import { computed } from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider/config.context'

export function useIsReducedMotion() {
  const configContext = useInjectConfigContext(null)
  const systemReducedMotion = useSystemReducedMotion()

  return computed(() => configContext?.reducedMotion.value === true || systemReducedMotion.value)
}
