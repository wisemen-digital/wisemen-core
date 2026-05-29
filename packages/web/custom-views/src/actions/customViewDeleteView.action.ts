import { createAction } from '@wisemen/vue-core-actions'
import {
  UIConfirmDialog,
  useOverlay,
} from '@wisemen/vue-core-design-system'
import { Trash01Icon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewDeleteViewAction() {
  const i18n = useI18n()
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
    name: () => i18n.t('action.custom_view.delete'),
    execute: (ctx) => {
      const customView = ctx.targetedModelOfTypeOrThrow('CustomView')

      confirmDialog.open({
        title: i18n.t('action.custom_view.delete_confirm_title'),
        isDestructive: true,
        confirmLabel: i18n.t('action.custom_view.delete_confirm_label'),
        description: i18n.t('action.custom_view.delete_confirm_description', { name: customView.name }),
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
