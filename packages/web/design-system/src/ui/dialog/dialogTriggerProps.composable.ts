import { computed } from 'vue'

import type { DialogTriggerProps } from '@/ui/dialog/dialog.type'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

export function useDialogTriggerProps(id: symbol) {
  const overlay = useOverlay()

  const triggerProps = computed<DialogTriggerProps>(() => {
    const isOpen = overlay.overlays.find((o) => o.id === id)?.isOpen ?? false

    return {
      'aria-expanded': isOpen,
      'aria-haspopup': 'dialog',
      'data-state': isOpen ? 'open' : 'closed',
    }
  })

  return {
    triggerProps,
  }
}
