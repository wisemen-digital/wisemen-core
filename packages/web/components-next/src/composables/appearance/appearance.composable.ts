import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'

export type Appearance = 'dark' | 'light' | 'system'

/**
 * @deprecated - `useAppearance` has been deprecated. Please use `useStorage`
 * directly in your project moving forward. It will be removed in the next major version.
 */
export function useAppearance(): Ref<Appearance> {
  const appearance = useStorage<Appearance>('theme', () => 'light')

  return appearance
}
