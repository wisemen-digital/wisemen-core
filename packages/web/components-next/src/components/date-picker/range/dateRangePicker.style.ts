import type { VariantProps } from 'tailwind-variants'

import { createSharedDatePickerStyle } from '@/components/date-picker/shared/sharedDatePicker.style'
import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createDateRangePickerStyle = tv({
  extend: createSharedDatePickerStyle,
  slots: {
    innerDate: new StyleBuilder()
      .withSize('size-full')
      .withFlex('flex items-center justify-center')
      .withBorderRadius('rounded-full')
      // Highlighted (start, end) | Selected (start, end)
      .withBackgroundColor('group-data-highlighted-start/date:bg-brand-solid group-data-highlighted-end/date:bg-brand-solid group-data-selection-start/date:bg-brand-solid group-data-selection-end/date:bg-brand-solid')
      // Hover TODO: find out why not- doesn't work
      // TODO: got it!!! (not selected)
      .withBackgroundColor('not-group-data-selected/date:group-hover/date:bg-brand-primary')
      .build(),
    date: new StyleBuilder()
      .withBase('group/date relative select-none isolate data-outside-view:invisible')
      .withFlex('flex items-center justify-center')
      .withFontSize('text-sm')
      .withColor('text-secondary not-data-highlighted:not-data-highlighted-start:not-data-selected:not-data-selection-start:not-data-selection-end:data-outside-view:text-disabled')
      // Disabled
      .withColor('data-disabled:text-disabled')
      // Unavailable
      .withColor('data-unavailable:text-disabled')
      // Highlighted (start, between, end) | Selected (start, between, end)
      .withBackgroundColor('data-highlighted:bg-brand-secondary data-selected:bg-brand-secondary data-highlighted-start:bg-brand-secondary data-highlighted-end:bg-brand-secondary data-selection-start:bg-brand-secondary data-selection-end:bg-brand-secondary')
      // Dark
      .withBackgroundColor('dark:data-highlighted:bg-brand-950 dark:data-selected:bg-brand-950 dark:data-highlighted-start:bg-brand-950 dark:data-highlighted-end:bg-brand-950 dark:data-selection-start:bg-brand-950 dark:data-selection-end:bg-brand-950')
      .withColor('data-highlighted:text-brand-primary data-selected:text-brand-primary data-highlighted-start:text-brand-primary data-highlighted-end:text-brand-primary data-selection-start:text-brand-primary data-selection-end:text-brand-primary')
      // Highlighted (start, end) | Selected (start, end)
      .withColor('data-highlighted-start:text-primary-on-brand data-highlighted-end:text-primary-on-brand data-selection-start:text-primary-on-brand data-selection-end:text-primary-on-brand')
      // Highlighted (start, end) | Selected (start, end) | first day of week | last day of week
      .withBorderRadius('data-first-day-of-week:rounded-l-full data-first-day-of-month:rounded-l-full data-last-day-of-week:rounded-r-full data-last-day-of-month:rounded-r-full data-selection-start:rounded-l-full data-selection-end:rounded-r-full data-highlighted-start:rounded-l-full data-highlighted-end:rounded-r-full data-highlighted-end:not-data-highlighted-start:not-data-first-day-of-week:not-data-first-day-of-month:rounded-l-none')
      .withCursor('cursor-pointer data-disabled:cursor-not-allowed')
      .withSize('size-10')
      .withOutline('outline-brand-500 data-selected:outline-offset-2')
      .build(),
    todayIndicator: new StyleBuilder()
      .withBase('absolute bottom-1 left-1/2 -translate-x-1/2')
      .withSize('size-1')
      .withBorderRadius('rounded-full')
      .withBackgroundColor('bg-brand-solid group-data-selection-start/date:bg-white group-data-selection-end/date:bg-white group-data-highlighted-start/date:bg-white group-data-highlighted-end/date:bg-white')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type DateRangePickerStyle = VariantProps<typeof createDateRangePickerStyle>
export type CreateDateRangePickerStyle = ReturnType<typeof createDateRangePickerStyle>
