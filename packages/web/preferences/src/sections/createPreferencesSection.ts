import type { PreferencesSection } from '#types/preferences.type'

export function createPreferencesSection<TSectionId extends string>(
  section: PreferencesSection<TSectionId>,
): PreferencesSection<TSectionId> {
  return section
}

export interface CreatePreferencesSectionOptions<TValue> {
  get: () => TValue
  set: (value: TValue) => void
}
