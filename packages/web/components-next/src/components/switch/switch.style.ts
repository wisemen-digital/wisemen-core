import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createSwitchStyle = tv({
  slots: {
    root: new StyleBuilder()
      .withBase('group/switch relative overflow-hidden isolate')
      .withPadding('px-xxs')
      .withBorder('border border-solid border-tertiary dark:border-primary data-[state=checked]:border-brand-600 data-[state=checked]:disabled:border-disabled-subtle disabled:border-disabled-subtle')
      // Error
      .withBorder('data-invalid:data-[state=checked]:border-error data-invalid:data-[state=unchecked]:border-error')
      .withBorderRadius('rounded-full')
      .withBackgroundColor('bg-tertiary data-[state=checked]:bg-brand-solid disabled:data-[state=checked]:bg-disabled-subtle disabled:bg-disabled-subtle')
      // Error
      .withBackgroundColor('data-invalid:data-[state=checked]:bg-error-solid data-invalid:bg-error-primary')
      .withOutline('outline-brand-600 outline-offset-3 data-invalid:outline-error-600')
      .withCursor('cursor-pointer disabled:cursor-not-allowed')
      .withTransition('duration-200')
      .build(),
    thumb: new StyleBuilder()
      .withBase('block overflow-hidden')
      .withFlex('flex items-center justify-center')
      .withBackgroundColor('bg-white')
      .withBorderRadius('rounded-full')
      .withShadow('shadow-xs')
      .withTransition('duration-200')
      .build(),
    thumbIcon: new StyleBuilder()
      .withColor('text-gray-800 group-data-[state=checked]/switch:text-brand-600')
      .build(),
  },
  variants: {
    variant: {},
    size: {
      md: {
        root: new StyleBuilder()
          .withSize('w-11 h-6')
          .build(),
        thumb: new StyleBuilder()
          .withSize('size-5 data-[state=checked]:translate-x-[1.15rem]')
          .build(),
        thumbIcon: new StyleBuilder()
          .withSize('size-3.5')
          .build(),
      },
      sm: {
        root: new StyleBuilder()
          .withSize('w-9 h-5')
          .build(),
        thumb: new StyleBuilder()
          .withSize('size-4 data-[state=checked]:translate-x-[0.9rem]')
          .build(),
        thumbIcon: new StyleBuilder()
          .withSize('size-3')
          .build(),
      },
    },
  },
})

export type SwitchStyle = VariantProps<typeof createSwitchStyle>
export type CreateSwitchStyle = ReturnType<typeof createSwitchStyle>
