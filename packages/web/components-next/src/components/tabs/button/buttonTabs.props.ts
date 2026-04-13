import type {
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export interface ButtonTabsItemProps extends TestId, InteractableElement {
  /**
   * Unique identifier for the tab item.
   */
  value: string
}

export interface ButtonTabsContentProps extends TestId {
  /**
   * The value corresponding to a specific tab item.
   * It determines which content is displayed when a tab is selected.
   */
  value: string
}
