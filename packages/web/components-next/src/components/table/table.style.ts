import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createTableStyle = tv({
  slots: {
    cell: new StyleBuilder()
      .withBase('group/cell whitespace-nowrap relative')
      .withBackgroundColor('bg-primary group-[&:has(:focus-visible)]/row:bg-secondary')
      .withColor('text-tertiary data-primary-cell:text-primary')
      .withFontWeight('data-primary-cell:font-semibold')
      .withFontSize('text-sm')
      .withFlex('flex items-center')
      .withPadding('py-xl px-3xl')
      .withHeight('h-full')
      .withTransition('duration-100')
      .build(),
    cellSkeleton: new StyleBuilder()
      .withPadding('py-xl px-3xl')
      .build(),
    header: new StyleBuilder()
      .withBase('sticky top-0')
      .withZIndex('z-5')
      .withBorder('border-b border-solid border-b-secondary')
      .build(),
    headerCell: new StyleBuilder()
      .withBackgroundColor('bg-secondary')
      .withPadding('py-lg px-3xl')
      .build(),
    headerCellLabel: new StyleBuilder()
      .withFontSize('text-sm')
      .withFontWeight('font-medium')
      .withColor('text-secondary')
      .build(),
    hiddenResultsHint: new StyleBuilder()
      .withBase('sticky left-0 col-span-full')
      .withBorder('border-t border-solid border-t-secondary')
      .withPadding('py-xl')
      .withFlex('gap-x-lg flex items-center justify-center')
      .build(),
    root: new StyleBuilder()
      .withBase('overflow-hidden isolate')
      .withBorder('border border-solid border-secondary')
      .withFlex('flex flex-col')
      .withBorderRadius('rounded-lg')
      .build(),
    row: new StyleBuilder()
      .withBase('group/row relative')
      .withBackgroundColor('bg-primary [&:has(:focus-visible)]:bg-secondary')
      .withBorder('border-b border-solid border-b-secondary')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type TableStyle = VariantProps<typeof createTableStyle>
export type CreateTableStyle = ReturnType<typeof createTableStyle>
