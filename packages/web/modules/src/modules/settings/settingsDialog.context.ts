import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'

interface SettingsDialogContext {
  isExpanded: Ref<boolean>
}

export const [
  useProvideSettingsDialogContext,
  useInjectSettingsDialogContext,
] = useContext<SettingsDialogContext>('settingsDialogContext')
