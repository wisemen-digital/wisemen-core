import type { CustomViewColor } from '@/types/customViewColor.type'
import type { CustomViewIcon } from '@/types/customViewIcon.type'

export interface CustomView<TState extends Record<string, unknown> = any> {
  id: string
  isDefault: boolean
  isEditable: boolean
  name: string
  color: CustomViewColor
  icon: CustomViewIcon | null
  state: TState
}

export interface CreateCustomViewMeta {
  isDefault: boolean
  name: string
  color: CustomViewColor
  icon: CustomViewIcon
}

export interface UpdateCustomViewMeta {
  isDefault: boolean
  name: string
  color: CustomViewColor
  icon?: CustomViewIcon
}
