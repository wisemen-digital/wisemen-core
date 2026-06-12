import type { CustomView } from '@/types/customView.type'

export interface CustomViewStorageAdapter {
  load: () => CustomView[]
  save: (views: CustomView[]) => void
}
