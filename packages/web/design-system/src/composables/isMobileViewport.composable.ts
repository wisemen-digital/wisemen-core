import {
  createSharedComposable,
  useBreakpoints,
} from '@vueuse/core'
import type { ComputedRef } from 'vue'

/**
 * Below this width, components switch to their mobile presentation
 * (Select and Autocomplete render a bottom drawer instead of a popover,
 * the date range picker shows a single month instead of two, ...).
 */
const MOBILE_VIEWPORT_BREAKPOINT = 768

export const useIsMobileViewport = createSharedComposable((): ComputedRef<boolean> => {
  const screen = useBreakpoints({
    mobile: MOBILE_VIEWPORT_BREAKPOINT,
  })

  return screen.smaller('mobile')
})
