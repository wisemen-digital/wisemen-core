import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createCheckboxStyle = tv({
  slots: {
    control: new StyleBuilder()
      .withBase('relative overflow-hidden isolate')
      .withSize('size-4')
      .withFlex('flex items-center justify-center')
      .withBorder('border border-solid border-primary group-data-[state=checked]/checkbox:border-brand-600 group-data-[state=checked]/checkbox:group-disabled/checkbox:border-disabled disabled:border-disabled')
      // Error
      .withBorder('group-data-invalid/checkbox:group-data-[state=checked]/checkbox:border-error group-data-invalid/checkbox:group-data-[state=unchecked]/checkbox:border-error')
      .withBorderRadius('rounded-xs')
      .withBackgroundColor('group-data-[state=checked]/checkbox:bg-brand-solid group-disabled/checkbox:group-data-[state=checked]/checkbox:bg-disabled-subtle group-disabled/checkbox:bg-disabled-subtle')
      // Error
      .withBackgroundColor('group-data-invalid/checkbox:group-data-[state=checked]/checkbox:bg-error-solid')
      .withOutline('outline-2 outline-transparent group-focus-visible/checkbox:outline-brand-600 outline-offset-1 group-focus-visible/checkbox:group-data-invalid/checkbox:outline-error-600')
      .withTransition('duration-300')
      .build(),
    indicator: new StyleBuilder()
      .withBase('block')
      .withColor('text-primary-on-brand group-data-disabled/checkbox:text-fg-disabled-subtle')
      .withSize('size-3')
      .build(),
    root: new StyleBuilder()
      .withBase('group/checkbox outline-none')
      .withFlex('flex items-center justify-start')
      .withCursor('cursor-pointer disabled:cursor-not-allowed')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type CheckboxStyle = VariantProps<typeof createCheckboxStyle>
export type CreateCheckboxStyle = ReturnType<typeof createCheckboxStyle>
