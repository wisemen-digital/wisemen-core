import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createAvatarStyle = tv({
  slots: {
    fallback: new StyleBuilder()
      .withBase('uppercase')
      .withFontSize('text-sm')
      .withColor('text-secondary')
      .withFontWeight('font-medium')
      .build(),
    image: new StyleBuilder()
      .withSize('size-full')
      .build(),
    root: new StyleBuilder()
      .withBase('overflow-hidden')
      .withFlex('flex items-center justify-center')
      .withSize('size-10')
      .withBackgroundColor('bg-tertiary')
      .withBorderRadius('rounded-full')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type AvatarStyle = VariantProps<typeof createAvatarStyle>
export type CreateAvatarStyle = ReturnType<typeof createAvatarStyle>
