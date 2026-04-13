import type { Icon } from '@wisemen/vue-core-components'
import type {
  Component,
  ComputedRef,
} from 'vue'

export interface SettingsSection {
  id: string
  title: string | ComputedRef<string>
  description: string | ComputedRef<string>
  tags: ComputedRef<string[]> | string[]
  component: () => Component
}

export interface SettingsView {
  id: string
  title: string | ComputedRef<string>
  description?: string | ComputedRef<string>
  icon: Icon
  sections: SettingsSection[]
}

export interface SettingsCategory {
  title: string | ComputedRef<string>
  views: SettingsView[]
}

export interface SettingsConfig {
  categories: SettingsCategory[]
}

export type ViewIdFromConfig<T extends SettingsConfig>
  = T['categories'][number]['views'][number]['id']
