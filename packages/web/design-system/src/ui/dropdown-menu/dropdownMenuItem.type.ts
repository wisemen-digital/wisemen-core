import type { Component } from 'vue'

import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'

export interface DropdownMenuItem extends WithKeyboardShortcut {
  icon: Component
  label: string
  onSelect: () => void
}
