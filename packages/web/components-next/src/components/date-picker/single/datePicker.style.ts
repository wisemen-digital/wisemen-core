import type { VariantProps } from 'tailwind-variants'

import { createSharedDatePickerStyle } from '@/components/date-picker/shared/sharedDatePicker.style'
import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createDatePickerStyle = tv({
  extend: createSharedDatePickerStyle,
  slots: {
    date: new StyleBuilder()
      .withColor('text-secondary data-selected:text-primary-on-brand data-outside-view:text-disabled data-disabled:text-disabled data-unavailable:text-disabled')
      .withBackgroundColor('not-data-disabled:hover:bg-tertiary data-selected:bg-brand-solid data-selected:hover:bg-brand-solid-hover')
      .withBorderRadius('rounded-full')
      .build(),
    header: '',
    headerContainer: '',
    todayIndicator: new StyleBuilder()
      .withBackgroundColor('bg-brand-solid group-data-selected/date:bg-white')
      .build(),
    weekDayLabel: '',
  },
  variants: {
    variant: {},
  },
})

export type DatePickerStyle = VariantProps<typeof createDatePickerStyle>
export type CreateDatePickerStyle = ReturnType<typeof createDatePickerStyle>
