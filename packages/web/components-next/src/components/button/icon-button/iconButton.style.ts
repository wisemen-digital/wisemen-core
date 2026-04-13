import type { VariantProps } from 'tailwind-variants'

import { createSharedButtonStyle } from '@/components/button/shared/sharedButton.style'
import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createIconButtonStyle = tv({
  extend: createSharedButtonStyle,
  slots: {
    contentContainer: '',
    icon: '',
    loader: '',
    root: new StyleBuilder()
      .withFlex('flex items-center justify-center')
      .build(),
  },
  variants: {
    size: {
      '2xl': {
        icon: new StyleBuilder()
          .withSize('size-6')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-6')
          .build(),
        root: new StyleBuilder()
          .withSize('w-15')
          .build(),
      },
      'lg': {
        icon: new StyleBuilder()
          .withSize('size-5')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-5')
          .build(),
        root: new StyleBuilder()
          .withSize('w-11')
          .build(),
      },
      'md': {
        icon: new StyleBuilder()
          .withSize('size-5')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-5')
          .build(),
        root: new StyleBuilder()
          .withSize('w-10')
          .build(),
      },
      'sm': {
        icon: new StyleBuilder()
          .withSize('size-4')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-4')
          .build(),
        root: new StyleBuilder()
          .withSize('w-9')
          .build(),
      },
      'xl': {
        icon: new StyleBuilder()
          .withSize('size-5')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-5')
          .build(),
        root: new StyleBuilder()
          .withSize('w-12')
          .build(),
      },
    },
  },
})

export type IconButtonStyle = VariantProps<typeof createIconButtonStyle>
export type CreateIconButtonStyle = ReturnType<typeof createIconButtonStyle>
