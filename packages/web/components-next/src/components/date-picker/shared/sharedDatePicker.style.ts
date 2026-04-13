import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createSharedDatePickerStyle = tv({
  slots: {
    date: new StyleBuilder()
      .withBase('group/date relative select-none isolate')
      .withFlex('flex items-center justify-center')
      .withFontSize('text-sm')
      .withCursor('cursor-pointer data-disabled:cursor-not-allowed')
      .withSize('size-10')
      .withOutline('outline-brand-500 data-selected:outline-offset-2')
      .build(),
    grid: new StyleBuilder()
      .withSize('w-70')
      .build(),
    gridBody: new StyleBuilder()
      .withFlex('flex flex-col gap-y-xs')
      .build(),
    gridContainer: new StyleBuilder()
      .withBase('flex gap-xl')
      .build(),
    gridRow: new StyleBuilder()
      .withBase('grid grid-cols-7 items-center')
      .build(),
    header: new StyleBuilder()
      .withGrid('grid grid-cols-[1fr_auto_1fr] items-center')
      .withSize('size-full')
      .build(),
    headerContainer: new StyleBuilder()
      .withFlex('flex justify-between gap-xl')
      .withMargin('mb-lg')
      .build(),
    monthSeparator: new StyleBuilder()
      .withSize('w-px')
      .withBackgroundColor('bg-tertiary')
      .build(),
    todayIndicator: new StyleBuilder()
      .withBase('absolute bottom-1 left-1/2 -translate-x-1/2')
      .withSize('size-1')
      .withBorderRadius('rounded-full')
      .build(),
    weekDayLabel: new StyleBuilder()
      .withFontWeight('font-medium')
      .withColor('text-secondary')
      .withFontSize('text-sm')
      .withSize('size-10')
      .withFlex('flex items-center justify-center')
      .build(),

  },
  variants: {
    variant: {},
  },
})

export type SharedDatePickerStyle = VariantProps<typeof createSharedDatePickerStyle>
export type CreateSharedDatePickerStyle = ReturnType<typeof createSharedDatePickerStyle>
