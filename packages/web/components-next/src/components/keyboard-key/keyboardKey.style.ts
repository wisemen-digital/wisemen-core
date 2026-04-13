import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createKeyboardKeyStyle = tv({
  slots: {
    key: new StyleBuilder()
      .withBase('text-center font-sans capitalize')
      .withBackgroundColor('dark:bg-secondary')
      .withFontSize('text-[0.6875rem]')
      .withColor('text-tertiary')
      .withSize('h-5 min-w-5')
      .withPadding('px-xs')
      .withFlex('flex items-center justify-center')
      .withBorderRadius('rounded-xs')
      .withShadow('shadow-keyboard-key')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type keyboardKeyStyle = VariantProps<typeof createKeyboardKeyStyle>
export type CreatekeyboardKeyStyle = ReturnType<typeof createKeyboardKeyStyle>
