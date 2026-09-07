import type {
  PreferencesSection,
  PreferencesView,
} from '#types/preferences.type'

/**
 * Resolves the flat list of all sections belonging to a view. When the view
 * defines `tabs` and no explicit `sections`, the tabs' sections are flattened
 * in declaration order. An explicit `sections` array always takes priority.
 */
export function getViewSections(view: PreferencesView): PreferencesSection[] {
  if (view.sections !== undefined) {
    return view.sections
  }

  return view.tabs?.flatMap((tab) => tab.sections) ?? []
}
