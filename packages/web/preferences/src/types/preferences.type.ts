import type {
  Component,
  ComputedRef,
  Raw,
} from 'vue'

export interface PreferencesSection<TId extends string = string> {
  id: TId
  title: string | ComputedRef<string>
  description: string | ComputedRef<string>
  tags: ComputedRef<string[]> | string[]
  component: () => Component
}

export interface PreferencesView {
  id: string
  title: string | ComputedRef<string>
  description?: string | ComputedRef<string>
  icon: Raw<Component>
  sections: PreferencesSection[]
}

export interface PreferencesCategory {
  title?: string | ComputedRef<string>
  views: PreferencesView[]
}

export interface PreferencesConfig {
  appVersion?: string
  categories: PreferencesCategory[]
}

export type ViewIdFromConfig<T extends PreferencesConfig>
  = T['categories'][number]['views'][number]['id']

export type SectionIdFromConfig<
  T extends PreferencesConfig,
  TViewId extends ViewIdFromConfig<T> = ViewIdFromConfig<T>,
> = Extract<T['categories'][number]['views'][number], { id: TViewId }>['sections'][number]['id']
