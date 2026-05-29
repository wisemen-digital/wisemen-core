import { createAction } from '@wisemen/vue-core-actions'
import {
  UIConfirmDialog,
  useOverlay,
} from '@wisemen/vue-core-design-system'
import { Trash01Icon } from '@wisemen/vue-core-icons'

import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewDeleteViewAction() {
  const overlay = useOverlay()
  const confirmDialog = overlay.create(UIConfirmDialog)
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-delete-view',
    isApplicable: (ctx) => {
      if (customViewManagerContext.views.value.length === 1) {
        return false
      }

      const customView = ctx.targetedModelOfType('CustomView')

      if (customView === null) {
        return false
      }

      return customView.isEditable
    },
    name: () => 'Delete',
    execute: (ctx) => {
      const customView = ctx.targetedModelOfTypeOrThrow('CustomView')

      confirmDialog.open({
        title: 'Delete view',
        isDestructive: true,
        confirmLabel: 'Delete',
        description: `Are you sure you want to delete <em>${customView.name}</em>?`,
        onConfirm: () => {
          customViewManagerContext.deleteView(customView.id)
          confirmDialog.close()
        },
      })
    },
    group: customViewManagerContext.actionGroup,
    icon: () => Trash01Icon,
    separatorGroup: 'delete',
  })
}
