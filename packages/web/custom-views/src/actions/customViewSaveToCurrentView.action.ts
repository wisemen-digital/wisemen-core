import { createAction } from '@wisemen/vue-core-actions'
import { BookmarkCheckIcon } from '@wisemen/vue-core-icons'

import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewSaveToCurrentViewAction() {
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-save-to-current-view',
    name: () => 'Save to this view',
    isApplicable: () => customViewManagerContext.activeView.value.isEditable,
    execute: () => {
      customViewManagerContext.saveToCurrentView()
    },
    group: customViewManagerContext.actionGroup,
    icon: () => BookmarkCheckIcon,
  })
}
