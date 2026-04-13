import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createPopoverStyle = tv({
  slots: {
    arrow: new StyleBuilder()
      .withClasses('absolute left-1/2 rotate-45')
      .withSize('size-4')
      .withTranslate('-translate-x-1/2 -translate-y-3')
      .withBorderRadius('rounded-xxs')
      .withBackgroundColor('bg-primary')
      .withBorder('border border-solid border-secondary')
      .withShadow('shadow-lg')
      .build(),
    content: new StyleBuilder()
      .withBase('relative overflow-hidden data-[content-width=anchor-width]:w-(--reka-popover-trigger-width) data-[content-width=available-width]:w-(--reka-popover-content-available-width)')
      .withHeight('max-h-(--reka-popper-available-height)')
      .withFlex('flex flex-col')
      .withBackgroundColor('bg-primary')
      .withBorder('border border-solid border-secondary')
      .withBorderRadius('rounded-lg')
      .withSize('size-full')
      .withBorderRadius('rounded-lg')
      .withShadow('shadow-lg')
      .withZIndex('z-40')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type PopoverStyle = VariantProps<typeof createPopoverStyle>
export type CreatePopoverStyle = ReturnType<typeof createPopoverStyle>
