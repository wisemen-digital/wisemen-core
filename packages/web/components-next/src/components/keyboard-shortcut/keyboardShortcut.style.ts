import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createKeyboardShortcutStyle = tv({
  slots: {
    root: new StyleBuilder()
      .withFlex('flex items-center gap-x-1')
      .build(),
    thenLabel: new StyleBuilder()
      .withBase('font-regular')
      .withFontSize('text-xs')
      .withColor('text-tertiary')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type keyboardShortcutStyle = VariantProps<typeof createKeyboardShortcutStyle>
export type CreateKeyboardShortcutStyle = ReturnType<typeof createKeyboardShortcutStyle>
