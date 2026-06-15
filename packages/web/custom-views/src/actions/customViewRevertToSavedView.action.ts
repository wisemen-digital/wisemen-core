import { createAction } from '@wisemen/vue-core-actions'
import { FlipBackwardIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewRevertToSavedViewAction() {
  const i18n = useI18n()
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-revert-to-saved-view',
    isApplicable: () => customViewManagerContext.isDirty.value,
    name: () => i18n.t('action.custom_view.revert_to_saved'),
    execute: () => {
      customViewManagerContext.revertToSavedView()
    },
    group: customViewManagerContext.actionGroup,
    icon: () => FlipBackwardIcon,
    separatorGroup: 'revert',
  })
}
