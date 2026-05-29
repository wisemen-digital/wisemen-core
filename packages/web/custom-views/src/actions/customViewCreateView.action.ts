import { createAction } from '@wisemen/vue-core-actions'
import { useOverlay } from '@wisemen/vue-core-design-system'
import { BookmarkAddIcon } from '@wisemen/vue-core-icons'

import CustomViewCreateDialog from '@/components/CustomViewCreateDialog.vue'
import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewCreateViewAction() {
  const overlay = useOverlay()
  const customViewCreateDialog = overlay.create(CustomViewCreateDialog)
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-save-to-new-view',
    name: () => 'Create new view',
    execute: () => {
      customViewCreateDialog.open({
        onSave: (view) => {
          customViewManagerContext.createView(view)
          customViewCreateDialog.close()
        },
      })
    },
    group: customViewManagerContext.actionGroup,
    icon: () => BookmarkAddIcon,
  })
}
