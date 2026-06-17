import type { CustomViewColor } from '@/types/customViewColor.type'
import type { CustomViewIcon } from '@/types/customViewIcon.type'

export interface CustomView<TState extends Record<string, unknown> = any> {
  id: string
  isEditable: boolean
  name: string
  color: CustomViewColor
  icon: CustomViewIcon | null
  state: TState
}

export interface CreateCustomViewMeta {
  name: string
  color: CustomViewColor
  icon: CustomViewIcon
}

export interface UpdateCustomViewMeta {
  name: string
  color: CustomViewColor
  icon?: CustomViewIcon
}
