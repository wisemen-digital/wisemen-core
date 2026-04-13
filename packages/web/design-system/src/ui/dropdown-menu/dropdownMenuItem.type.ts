import type { Component } from 'vue'

export interface DropdownMenuItem {
  icon: Component
  keyboardShortcut?: string
  label: string
  onSelect: () => void
}
