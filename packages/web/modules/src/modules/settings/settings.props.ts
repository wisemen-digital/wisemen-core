import type {
  SettingsConfig,
  ViewIdFromConfig,
} from '@/modules/settings/settings.type'

export interface SettingsProps<TConfig extends SettingsConfig> {
  /**
   * Represents the currently active view within the settings module.
   * This property is optional and can be used to specify or track
   * the active view based on the provided configuration.
   *
   * External consumers can use this property to control or respond
   * to changes in the active view.
   */
  activeView?: ViewIdFromConfig<TConfig>
  /**
   * Represents the configuration object for the settings module.
   * This property is required and defines the structure and behavior of the settings view.
   */
  config: TConfig
}
