import type { SharedDateProps } from '@/types/shareDateProps.type'
import type {
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export interface SharedDatePickerProps extends TestId, InteractableElement, SharedDateProps {
  /**
   * The day the week starts on, where 0 represents Sunday, 1 represents Monday, and so on up to 6 for Saturday.
   * @default 0
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Whether the calendar should focus on the selected day, today’s date,
   * or the first day of the month when mounted.
   * @default false
   */
  focusOnMount?: boolean
  /**
   * The accessible label for the date picker.
   */
  label: string
}
