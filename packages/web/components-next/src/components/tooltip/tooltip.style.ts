import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createTooltipStyle = tv({
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
      .withBase('data-[content-width=anchor-width]:w-(--reka-tooltip-trigger-width) data-[content-width=available-width]:w-(--reka-tooltip-content-available-width)')
      .withZIndex('z-40')
      .build(),
    innerContent: new StyleBuilder()
      .withBackgroundColor('bg-primary')
      .withBorder('border border-solid border-secondary')
      .withBorderRadius('rounded-lg')
      .withBase('relative overflow-hidden')
      .withSize('size-full')
      .withBorderRadius('rounded-lg')
      .withShadow('shadow-lg')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type TooltipStyle = VariantProps<typeof createTooltipStyle>
export type CreateTooltipStyle = ReturnType<typeof createTooltipStyle>
