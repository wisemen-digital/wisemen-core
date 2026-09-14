import {
  createSharedComposable,
  useMediaQuery,
} from '@vueuse/core'
import type { ComputedRef } from 'vue'

/**
 * `(hover: none)` — no input mechanism on this device can hover — combined with
 * `(pointer: coarse)` — the primary pointer has limited accuracy — matches touch devices
 * without hover support, distinct from e.g. a touchscreen laptop that also has a mouse.
 */
export const useIsTouchDevice = createSharedComposable((): ComputedRef<boolean> => (
  useMediaQuery('(hover: none) and (pointer: coarse)')
))
