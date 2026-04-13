import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createRadioGroupItemStyle = tv({
  slots: {
    control: new StyleBuilder()
      .withBase('relative overflow-hidden isolate')
      .withSize('size-4')
      .withFlex('flex items-center justify-center')
      // Default
      .withBorder('border border-solid border-primary group-data-[state=checked]/radio-group-item:border-brand-600')
      // Disabled
      .withBorder('group-data-[state=checked]/radio-group-item:group-disabled/radio-group-item:border-disabled group-disabled/radio-group-item:border-disabled')
      // Error
      .withBorder('group-data-invalid/radio-group-item:group-data-[state=checked]/radio-group-item:border-error group-data-invalid/radio-group-item:group-data-[state=unchecked]/radio-group-item:border-error')
      .withBorderRadius('rounded-full')
      .withBackgroundColor('group-data-[state=checked]/radio-group-item:bg-brand-solid group-disabled/radio-group-item:group-data-[state=checked]/radio-group-item:bg-disabled-subtle group-disabled/radio-group-item:bg-disabled-subtle group-data-invalid/radio-group-item:group-data-[state=checked]/radio-group-item:bg-error-solid')
      .withOutline('outline-2 outline-transparent group-focus-visible/radio-group-item:outline-brand-600 outline-offset-1 group-focus-visible/radio-group-item:group-data-invalid/radio-group-item:outline-error-600')
      .withTransition('duration-300')
      .build(),
    indicator: new StyleBuilder()
      .withBase('block')
      .withColor('bg-white group-data-disabled/radio-group-item:bg-fg-disabled-subtle')
      .withSize('size-1.5')
      .withBorderRadius('rounded-full')
      .build(),
    root: new StyleBuilder()
      .withBase('group/radio-group-item')
      .withOutline('outline-none')
      .withCursor('cursor-pointer disabled:cursor-not-allowed')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type RadioGroupItemStyle = VariantProps<typeof createRadioGroupItemStyle>
export type CreateRadioGroupItemStyle = ReturnType<typeof createRadioGroupItemStyle>
