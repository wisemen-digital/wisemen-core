import { createAction } from '@wisemen/vue-core-actions'
import { useOverlay } from '@wisemen/vue-core-design-system'
import { Edit01Icon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import CustomViewUpdateDialog from '@/components/CustomViewUpdateDialog.vue'
import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'

export function useCustomViewEditViewAction() {
  const i18n = useI18n()
  const overlay = useOverlay()
  const viewUpdateDialog = overlay.create(CustomViewUpdateDialog)
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-edit-view',
    isApplicable: (ctx) => {
      const customView = ctx.targetedModelOfType('CustomView')

      if (customView === null) {
        return false
      }

      return customView.isEditable
    },
    name: () => i18n.t('action.custom_view.edit'),
    execute: (ctx) => {
      const customView = ctx.targetedModelOfTypeOrThrow('CustomView')

      viewUpdateDialog.open({
        view: customView,
        onSave: (view) => {
          customViewManagerContext.updateViewMeta(customView.id, view)
          viewUpdateDialog.close()
        },
      })
    },
    group: customViewManagerContext.actionGroup,
    icon: () => Edit01Icon,
  })
}
