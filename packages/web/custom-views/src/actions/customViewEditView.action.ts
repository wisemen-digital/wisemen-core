import { createAction } from '@wisemen/vue-core-actions'
import { useOverlay } from '@wisemen/vue-core-design-system'
import { Edit01Icon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import CustomViewUpdateDialog from '@/components/CustomViewUpdateDialog.vue'
import { useInjectCustomViewManagerContext } from '@/context/customViewManager.context'
import type { CustomView } from '@/types/customView.type'

export function useCustomViewEditViewAction() {
  const i18n = useI18n()
  const overlay = useOverlay()
  const viewUpdateDialog = overlay.create(CustomViewUpdateDialog)
  const customViewManagerContext = useInjectCustomViewManagerContext()

  return createAction({
    id: 'custom-view-edit-view',
    isApplicable: (ctx) => {
      const customView = ctx.targetedModelOfType('CustomView') as CustomView | null

      if (customView === null) {
        return false
      }

      return customView.isEditable
    },
    name: () => i18n.t('action.custom_view.edit'),
    execute: (ctx) => {
      const customView = ctx.targetedModelOfTypeOrThrow('CustomView') as unknown as CustomView

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
