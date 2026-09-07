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

export interface PreferencesViewTab {
  id: string
  title: string | ComputedRef<string>
  sections: PreferencesSection[]
}

export interface PreferencesView {
  id: string
  title: string | ComputedRef<string>
  description?: string | ComputedRef<string>
  icon: Raw<Component>
  /**
   * Flat list of all sections belonging to this view. Optional when `tabs` is set — the
   * flattened union of every tab's sections is used instead.
   */
  sections?: PreferencesSection[]
  /**
   * Optional tabs grouping this view's sections. When present, the header renders a tab strip
   * and the content area only shows the active tab's sections. If `sections` is omitted, it is
   * derived by flattening every tab's sections.
   */
  tabs?: PreferencesViewTab[]
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

type SectionIdFromView<TView extends PreferencesView>
  = | NonNullable<TView['sections']>[number]['id']
    | NonNullable<TView['tabs']>[number]['sections'][number]['id']

export type SectionIdFromConfig<
  T extends PreferencesConfig,
  TViewId extends ViewIdFromConfig<T> = ViewIdFromConfig<T>,
> = SectionIdFromView<Extract<T['categories'][number]['views'][number], { id: TViewId }>>
