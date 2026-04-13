import { useRefHistory } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import {
  computed,
  ref,
} from 'vue'

export interface HistoryItem {
  id: string
  type: 'section' | 'view'
}

export interface SettingsHistory {
  activeItem: ComputedRef<HistoryItem>
  canGoBack: ComputedRef<boolean>
  canGoForward: ComputedRef<boolean>
  goBack: () => void
  goForward: () => void
  onShowItem: (item: HistoryItem) => void
  onShowSection: (sectionId: string) => void
  onShowView: (viewId: string) => void
}

export function useSettingsHistory(defaultItem: HistoryItem): SettingsHistory {
  const activeItem = ref<HistoryItem>(defaultItem)
  const history = useRefHistory<HistoryItem>(activeItem)

  function goBack(): void {
    history.undo()
  }

  function goForward(): void {
    history.redo()
  }

  function onShowView(viewId: string): void {
    activeItem.value = {
      id: viewId,
      type: 'view',
    }
  }

  function onShowSection(sectionId: string): void {
    activeItem.value = {
      id: sectionId,
      type: 'section',
    }
  }

  function onShowItem(item: HistoryItem): void {
    activeItem.value = item
  }

  return {
    activeItem: computed<HistoryItem>(() => activeItem.value),
    canGoBack: computed<boolean>(() => history.canUndo.value),
    canGoForward: computed<boolean>(() => history.canRedo.value),
    goBack,
    goForward,
    onShowItem,
    onShowSection,
    onShowView,
  }
}
