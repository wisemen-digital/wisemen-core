import { createAction } from '@wisemen/vue-core-actions'
import { BookmarkCheckIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewSaveToCurrentViewAction() {
  const i18n = useI18n()
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-save-to-current-view',
    name: () => i18n.t('action.custom_view.save_to_current'),
    isApplicable: () => customViewManagerContext.activeView.value.isEditable,
    execute: () => {
      customViewManagerContext.saveToCurrentView()
    },
    group: customViewManagerContext.actionGroup,
    icon: () => BookmarkCheckIcon,
  })
}
