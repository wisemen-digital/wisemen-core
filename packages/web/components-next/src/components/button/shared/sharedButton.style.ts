import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

// Do not use `enabled:` since this won't work for the router link button.

export const createSharedButtonStyle = tv({
  slots: {
    root: new StyleBuilder()
      .withBase('group/button whitespace-nowrap overflow-hidden relative')
      .withOutline('focus-visible:outline-2 outline-offset-2 outline-brand-600')
      .withBorder('border border-solid')
      .withBorderRadius('rounded-md')
      .withCursor('cursor-pointer disabled:cursor-not-allowed data-[loading=true]:cursor-not-allowed')
      .withTransition('duration-100 data-[loading=false]:not-disabled:active:scale-99')
      .build(),
  },
  variants: {
    variant: {
      'destructive-primary': {
        root: new StyleBuilder()
          .withColor('text-white disabled:text-fg-disabled')
          .withBackgroundColor('bg-error-solid disabled:bg-disabled')
          .withBorder('border-error-600 disabled:border-disabled-subtle')
          .withOutline('outline-error-600')
          .withTransition('data-[loading=false]:not-disabled:hover:brightness-95 data-[loading=false]:not-disabled:active:brightness-90')
          .build(),
      },
      'destructive-secondary': {
        root: new StyleBuilder()
          .withColor('text-error-primary disabled:text-fg-disabled')
          .withBackgroundColor('bg-transparent data-[loading=false]:not-disabled:hover:bg-error-primary data-[loading=false]:not-disabled:active:brightness-98 data-[loading=true]:bg-error-primary')
          .withBorder('border-error-subtle disabled:border-disabled-subtle')
          .withOutline('outline-error-600')
          .build(),
      },
      'destructive-tertiary': {
        root: new StyleBuilder()
          .withColor('text-error-primary disabled:text-fg-disabled')
          .withBackgroundColor('bg-transparent data-[loading=false]:not-disabled:hover:bg-error-primary data-[loading=false]:not-disabled:active:brightness-98 data-[loading=true]:bg-error-primary')
          .withBorder('border-transparent')
          .withOutline('outline-error-600')
          .build(),
      },
      'primary': {
        root: new StyleBuilder()
          .withColor('text-white disabled:text-fg-disabled')
          .withBackgroundColor('bg-brand-solid disabled:bg-disabled')
          .withBorder('border-brand-600 disabled:border-disabled-subtle')
          .withTransition('data-[loading=false]:not-disabled:hover:brightness-95 data-[loading=false]:not-disabled:active:brightness-90')
          .build(),
      },
      'secondary': {
        root: new StyleBuilder()
          .withColor('text-secondary disabled:text-fg-disabled')
          .withBackgroundColor('bg-transparent data-[loading=false]:not-disabled:hover:bg-primary-hover data-[loading=false]:not-disabled:active:brightness-98 data-[loading=true]:bg-primary-hover')
          .withBorder('border-primary disabled:border-disabled-subtle')
          .build(),
      },
      'tertiary': {
        root: new StyleBuilder()
          .withColor('text-tertiary disabled:text-fg-disabled')
          .withBackgroundColor('bg-transparent data-[loading=false]:not-disabled:hover:bg-primary-hover data-[loading=false]:not-disabled:active:brightness-98 data-[loading=true]:bg-primary-hover')
          .withBorder('border-transparent')
          .build(),
      },
    },
    size: {
      '2xl': {
        root: new StyleBuilder()
          .withHeight('h-15')
          .withBorderRadius('rounded-lg')
          .build(),
      },
      'lg': {
        root: new StyleBuilder()
          .withHeight('h-11')
          .build(),
      },
      'md': {
        root: new StyleBuilder()
          .withHeight('h-10')
          .build(),
      },
      'sm': {
        root: new StyleBuilder()
          .withHeight('h-9')
          .build(),
      },
      'xl': {
        root: new StyleBuilder()
          .withHeight('h-12')
          .build(),
      },
    },
  },
})

export type SharedButtonStyle = VariantProps<typeof createSharedButtonStyle>
export type CreateSharedButtonStyle = ReturnType<typeof createSharedButtonStyle>
