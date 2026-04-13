import type { VariantProps } from 'tailwind-variants'

import { createSharedButtonStyle } from '@/components/button/shared/sharedButton.style'
import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createTextButtonStyle = tv({
  extend: createSharedButtonStyle,
  slots: {
    content: new StyleBuilder()
      .withClasses('[grid-area:stack] group-data-[loading=true]/button:invisible group-data-[loading=true]/button:opacity-0')
      .withFlex('flex items-center justify-center')
      .withTransition('duration-300 group-data-[loading=true]/button:scale-95 group-data-[loading=true]/button:blur-xxs')
      .build(),
    iconLeft: new StyleBuilder()
      .withBase('shrink-0')
      .build(),
    iconRight: new StyleBuilder()
      .withBase('shrink-0')
      .build(),
    loader: new StyleBuilder()
      .withClasses('[grid-area:stack] mx-auto group-data-[loading=false]/button:invisible group-data-[loading=false]/button:opacity-0')
      .withBase('shrink-0')
      .withTransition('duration-300 group-data-[loading=false]/button:scale-95')
      .build(),
    root: new StyleBuilder()
      .withGrid('grid items-center justify-center [grid-template-areas:"stack"]')
      .withFontWeight('font-medium')
      .build(),
  },
  variants: {
    size: {
      '2xl': {
        iconLeft: new StyleBuilder()
          .withMargin('mr-md')
          .withSize('size-5')
          .build(),
        iconRight: new StyleBuilder()
          .withMargin('ml-md')
          .withSize('size-5')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-5')
          .build(),
        root: new StyleBuilder()
          .withPadding('px-5.5')
          .withFontSize('text-lg')
          .withSize('min-w-15')
          .build(),
      },
      'lg': {
        iconLeft: new StyleBuilder()
          .withMargin('mr-sm')
          .withSize('size-4')
          .build(),
        iconRight: new StyleBuilder()
          .withMargin('ml-sm')
          .withSize('size-4')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-4')
          .build(),
        root: new StyleBuilder()
          .withPadding('px-xl')
          .withFontSize('text-md')
          .withSize('min-w-11')
          .build(),
      },
      'md': {
        iconLeft: new StyleBuilder()
          .withMargin('mr-xs')
          .withSize('size-4')
          .build(),
        iconRight: new StyleBuilder()
          .withMargin('ml-xs')
          .withSize('size-4')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-4.5')
          .build(),
        root: new StyleBuilder()
          .withPadding('px-3.5')
          .withFontSize('text-sm')
          .withSize('min-w-10')
          .build(),
      },
      'sm': {
        iconLeft: new StyleBuilder()
          .withMargin('mr-xs')
          .withSize('size-4')
          .build(),
        iconRight: new StyleBuilder()
          .withMargin('ml-xs')
          .withSize('size-4')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-4')
          .build(),
        root: new StyleBuilder()
          .withPadding('px-lg')
          .withFontSize('text-sm')
          .withSize('min-w-9')
          .build(),
      },
      'xl': {
        iconLeft: new StyleBuilder()
          .withMargin('mr-sm')
          .withSize('size-5')
          .build(),
        iconRight: new StyleBuilder()
          .withMargin('ml-sm')
          .withSize('size-5')
          .build(),
        loader: new StyleBuilder()
          .withSize('size-5')
          .build(),
        root: new StyleBuilder()
          .withPadding('px-4.5')
          .withFontSize('text-md')
          .withSize('min-w-12')
          .build(),
      },
    },
  },
})

export type TextButtonStyle = VariantProps<typeof createTextButtonStyle>
export type CreateTextButtonStyle = ReturnType<typeof createTextButtonStyle>
