import type { ActionContext } from '@wisemen/vue-core-actions'
import { _createUntypedAction } from '@wisemen/vue-core-actions'
import { useI18n } from 'vue-i18n'

import { useOverlay } from '@/ui'
import CommandMenu from '@/ui/command-menu/CommandMenu.vue'

export function useCommandMenuAction() {
  const i18n = useI18n()
  const overlay = useOverlay()
  const commandMenuDialog = overlay.create(CommandMenu)

  return _createUntypedAction({
    id: 'command-menu',
    isApplicable: (ctx: ActionContext) => ctx.menuType === undefined,
    name: () => i18n.t('action.global.open_command_menu.name'),
    execute: () => {
      const isOpen = overlay.isOpen(commandMenuDialog.id)

      if (isOpen) {
        commandMenuDialog.close()
      }
      else {
        commandMenuDialog.open()
      }
    },
    keyboardShortcut: {
      key: 'K',
      runWithInputFocus: true,
      meta: true,
    },
  })
}
