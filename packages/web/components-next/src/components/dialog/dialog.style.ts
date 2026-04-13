import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createDialogStyle = tv({
  slots: {
    content: new StyleBuilder()
      .withClasses('fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 outline-none overflow-hidden')
      .withZIndex('z-40')
      .withBorderRadius('rounded-2xl')
      .withBorder('dark:border border-solid border-tertiary')
      .withBackgroundColor('bg-primary')
      .withShadow('shadow-lg')
      .build(),
    overlay: new StyleBuilder()
      .withClasses('fixed inset-0 bg-black/30 backdrop-blur-sm')
      .withZIndex('z-39')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type DialogStyle = VariantProps<typeof createDialogStyle>
export type CreateDialogStyle = ReturnType<typeof createDialogStyle>
