import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createDateFieldStyle = tv({
  slots: {
    iconLeft: new StyleBuilder()
      .withBase('shrink-0')
      .withSize('size-4.5')
      .withSpacing('ml-3')
      .withColor('text-quaternary group-data-disabled/date-field:text-fg-disabled')
      .build(),
    iconRight: new StyleBuilder()
      .withBase('shrink-0')
      .withSize('size-4.5')
      .withSpacing('mr-3')
      .withColor('text-quaternary group-data-disabled/date-field:text-fg-disabled')
      .build(),
    input: new StyleBuilder()
      .withBase('outline-none')
      .withFontSize('text-sm')
      .withBackgroundColor('focus:bg-quaternary')
      .withPadding('px-0.5 data-[segment=literal]:px-0')
      .withBorderRadius('rounded-xs')
      .withColor('text-primary data-placeholder:text-placeholder data-[segment=literal]:text-placeholder group-data-disabled/date-field:text-disabled')
      .withCursor('disabled:cursor-not-allowed')
      .withTransition('duration-200')
      .build(),
    inputs: new StyleBuilder()
      .withFlex('flex items-center')
      .withSize('size-full')
      .withPadding('pl-3 pr-2 group-data-icon-left/date-field:pl-2')
      .withBackgroundColor('group-data-disabled/date-field:bg-disabled-subtle')
      .build(),
    loader: new StyleBuilder()
      .withBase('shrink-0')
      .withSpacing('mr-3')
      .withSize('size-4')
      .withColor('text-quaternary')
      .build(),
    root: new StyleBuilder()
      .withBase('group/date-field overflow-hidden')
      .withFlex('flex items-center')
      .withHeight('h-10')
      // Default
      .withBorder('border border-solid border-primary focus-within:border-brand-500')
      // Disabled
      .withBorder('data-disabled:border-disabled-subtle')
      // Invalid
      .withBorder('data-invalid:border-error data-invalid:focus-within:border-error')
      .withBackgroundColor('bg-primary data-disabled:bg-disabled-subtle')
      .withBorderRadius('rounded-md')
      .withShadow('shadow-xs')
      .withOutline('outline outline-transparent focus-within:outline-brand-500 focus-within:data-invalid:outline-error-500')
      .withTransition('duration-200')
      .withCursor('data-disabled:cursor-not-allowed')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type DateFieldStyle = VariantProps<typeof createDateFieldStyle>
export type CreateDateFieldStyle = ReturnType<typeof createDateFieldStyle>
