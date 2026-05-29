import { useLocalStorage } from '@vueuse/core'

import type { CustomView } from '@/types/customView.type'
import type { CustomViewStorageAdapter } from '@/types/customViewStorageAdapter.type'

export function createCustomViewLocalStorageAdapter(storageKey: string): CustomViewStorageAdapter {
  const stored = useLocalStorage<CustomView[]>(storageKey, [], {
    deep: true,
  })

  return {
    load: (): CustomView[] => {
      try {
        return stored.value ?? []
      }
      catch {
        return []
      }
    },
    save: (views): void => {
      stored.value = views
    },
  }
}
