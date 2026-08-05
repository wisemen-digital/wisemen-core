import type { DisabledWithReason } from '@/types/disabledWithReason.type'
import type { InputWrapper } from '@/types/input.type'
import { INPUT_META_DEFAULTS } from '@/types/input.type'

export interface SegmentedControlSharedProps extends InputWrapper {
  /**
   * Centers each segment's label and description instead of left-aligning
   * them. Only affects segments that have a `description` set. Suits short,
   * symmetric content (e.g. a day-and-date picker) better than longer,
   * sentence-like labels, which usually read better left-aligned.
   * @default false
   */
  isDescriptionCentered?: boolean
  /**
   * Controls the keyboard navigation direction of the segmented control.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * The size of the segments. Matches the height of other form controls
   * (e.g. `TextField`, `Select`) when no item has a `description`.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}

export type SegmentedControlProps = SegmentedControlSharedProps

export type SegmentedControlGroupProps = SegmentedControlSharedProps

export interface SegmentedControlItemProps extends DisabledWithReason {
  /**
   * A description displayed underneath the label. When set, the item is
   * rendered taller to fit both lines and no longer aligns with the shared
   * form-control height.
   * @default null
   */
  description?: string | null
  /**
   * The label displayed for the segment.
   */
  label: string
  /**
   * The value of the segment.
   */
  value: string
}

const SEGMENTED_CONTROL_SHARED_DEFAULTS = {
  ...INPUT_META_DEFAULTS,
  isDescriptionCentered: false,
  orientation: 'horizontal',
  size: 'md',
} satisfies SegmentedControlSharedProps

export const SEGMENTED_CONTROL_DEFAULTS = SEGMENTED_CONTROL_SHARED_DEFAULTS satisfies SegmentedControlProps

export const SEGMENTED_CONTROL_GROUP_DEFAULTS = SEGMENTED_CONTROL_SHARED_DEFAULTS satisfies SegmentedControlGroupProps

export const SEGMENTED_CONTROL_ITEM_DEFAULTS = {
  isDisabled: false,
  description: null,
  disabledReason: null,
}
