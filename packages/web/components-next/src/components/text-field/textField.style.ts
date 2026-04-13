import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createTextFieldStyle = tv({
  slots: {
    iconLeft: new StyleBuilder()
      .withBase('shrink-0')
      .withSize('size-4.5')
      .withSpacing('ml-3')
      .withColor('text-quaternary group-data-disabled/text-field:text-fg-disabled')
      .build(),
    iconRight: new StyleBuilder()
      .withBase('shrink-0')
      .withSize('size-4.5')
      .withSpacing('mr-3')
      .withColor('text-quaternary group-data-disabled/text-field:text-fg-disabled')
      .build(),
    input: new StyleBuilder()
      .withBase('outline-none')
      .withSize('size-full')
      .withFontSize('text-sm')
      .withPadding('px-3 group-data-icon-left/text-field:pl-2 group-data-icon-right/text-field:pr-2')
      .withColor('text-primary disabled:text-disabled placeholder:text-placeholder')
      .withBackgroundColor('bg-transparent')
      .withCursor('disabled:cursor-not-allowed')
      .build(),
    loader: new StyleBuilder()
      .withBase('shrink-0')
      .withSpacing('mr-3')
      .withSize('size-4')
      .withColor('text-quaternary')
      .build(),
    root: new StyleBuilder()
      .withBase('group/text-field overflow-hidden')
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

export type TextFieldStyle = VariantProps<typeof createTextFieldStyle>
export type CreateTextFieldStyle = ReturnType<typeof createTextFieldStyle>
