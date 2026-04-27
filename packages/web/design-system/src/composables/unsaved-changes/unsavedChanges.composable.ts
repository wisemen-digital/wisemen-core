import type { ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'

import { useOverlay } from '@/ui'
import ConfirmDialog from '@/ui/dialog/ConfirmDialog.vue'

export function useUnsavedChanges(isDirty: ComputedRef<boolean>) {
  const i18n = useI18n()
  const overlay = useOverlay()
  const confirmDialog = overlay.create(ConfirmDialog)

  function showPrompt(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      void confirmDialog.open({
        title: i18n.t('component.unsaved_changes_dialog.title'),
        isDestructive: true,
        cancelLabel: i18n.t('component.unsaved_changes_dialog.cancel'),
        confirmLabel: i18n.t('component.unsaved_changes_dialog.confirm'),
        description: i18n.t('component.unsaved_changes_dialog.description'),
        onClose: () => {
          resolve(false)
        },
        onConfirm: () => {
          confirmDialog.close()
          resolve(true)
        },
      })
    })
  }

  onBeforeRouteLeave(async () => {
    if (isDirty.value) {
      return await showPrompt()
    }
  })

  window.addEventListener('beforeunload', () => {
    if (isDirty.value) {
      return i18n.t('component.unsaved_changes_dialog.description')
    }
  })
}
