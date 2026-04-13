import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createToastStyle = tv({
  slots: {
    title: new StyleBuilder()
      .withBase('truncate')
      .withFontSize('text-sm')
      .withColor('text-primary')
      .withFontWeight('font-semibold')
      .build(),
    actions: new StyleBuilder()
      .withFlex('flex items-center gap-x-sm mt-lg')
      .build(),
    description: new StyleBuilder()
      .withSpacing('mt-xs')
      .withBase('line-clamp-2')
      .withFontSize('text-sm')
      .withFontColor('text-secondary')
      .build(),
    icon: new StyleBuilder()
      .withSize('size-5')
      .withColor('group-data-[type=success]/toast:text-success-primary group-data-[type=error]/toast:text-error-primary group-data-[type=info]/toast:text-fg-brand-primary')
      .build(),
    root: new StyleBuilder()
      .withBase('group/toast relative pointer-events-auto')
      .withGrid('grid grid-cols-[auto_1fr] items-start gap-lg')
      .withSize('w-100')
      .withBorder('border border-solid border-secondary')
      .withBorderRadius('rounded-xl')
      .withBackgroundColor('bg-primary dark:bg-secondary')
      .withPadding('p-xl')
      .withShadow('shadow-lg')
      .withOutline('outline-brand-500')
      .build(),
  },
})

export type ToastStyle = VariantProps<typeof createToastStyle>
export type CreateToastStyle = ReturnType<typeof createToastStyle>
