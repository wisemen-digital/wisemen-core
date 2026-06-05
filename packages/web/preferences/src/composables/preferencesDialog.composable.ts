import { useOverlay } from '@wisemen/vue-core-design-system'

import PreferencesDialog from '#components/PreferencesDialog.vue'
import type {
  PreferencesConfig,
  SectionIdFromConfig,
  ViewIdFromConfig,
} from '#types/preferences.type'
import type { PreferencesProps } from '#types/preferencesDialog.props'

export function useCreatePreferencesDialog<const TConfig extends PreferencesConfig>(
  options: PreferencesProps<TConfig>,
) {
  const overlay = useOverlay()
  const preferencesDialog = overlay.create(PreferencesDialog)

  return {
    ...preferencesDialog,
    open: <TView extends ViewIdFromConfig<TConfig>>(
      initialView?: TView,
      initialSection?: SectionIdFromConfig<TConfig, TView>,
    ): Promise<unknown> => {
      return preferencesDialog.open({
        ...options,
        ...(initialView !== undefined
          ? {
              activeView: initialView,
            }
          : {}),
        ...(initialSection !== undefined
          ? {
              activeSection: initialSection,
            }
          : {}),
      })
    },
  }
}
