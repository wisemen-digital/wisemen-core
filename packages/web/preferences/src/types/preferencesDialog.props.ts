import type {
  PreferencesConfig,
  SectionIdFromConfig,
  ViewIdFromConfig,
} from '#types/preferences.type'

export interface PreferencesProps<TConfig extends PreferencesConfig> {
  activeSection?: SectionIdFromConfig<TConfig>
  activeView?: ViewIdFromConfig<TConfig>
  config: TConfig
}
