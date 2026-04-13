import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createSelectStyle = tv({
  slots: {
    base: new StyleBuilder()
      .withBase('overflow-hidden')
      .withFlex('flex items-center')
      .withSize('size-full')
      .build(),
    baseMultiple: new StyleBuilder()
      .withPadding('px-sm group-data-icon-left/select:pl-2 group-data-icon-right/select:pr-2')
      .withFlex('flex items-center gap-xs')
      .withSize('size-full')
      .build(),
    baseSingle: new StyleBuilder()
      .withFontSize('text-sm')
      .withColor('text-primary group-data-disabled/select:text-disabled')
      .withPadding('px-3 group-data-icon-left/select:pl-2 group-data-icon-right/select:pr-2')
      .withSize('w-full')
      .withFlex('flex items-center')
      .build(),
    content: new StyleBuilder()
      .withBase('outline-none min-w-(--reka-popover-trigger-width)')
      .withBase('overflow-auto')
      .withPadding('p-xs')
      .withHeight('max-h-80')
      .build(),
    empty: new StyleBuilder()
      .withColor('text-tertiary')
      .withFontSize('text-sm')
      .withPadding('p-sm')
      .build(),
    group: new StyleBuilder().build(),
    groupLabel: new StyleBuilder()
      .withColor('text-tertiary')
      .withFontSize('text-sm')
      .withFontWeight('font-medium')
      .withSpacing('py-xs')
      .build(),
    iconLeft: new StyleBuilder()
      .withBase('shrink-0')
      .withSize('size-4.5')
      .withSpacing('ml-3')
      .withColor('text-quaternary group-data-disabled/select:text-fg-disabled')
      .build(),
    iconRight: new StyleBuilder()
      .withBase('shrink-0')
      .withSize('size-4.5')
      .withSpacing('mr-3')
      .withColor('text-quaternary group-data-disabled/select:text-fg-disabled')
      .build(),
    inlineSearchInput: new StyleBuilder()
      .withOutline('outline-none')
      .withBase('z-10')
      .withSize('size-full')
      .withFontSize('text-sm')
      .withColor('text-primary')
      .withBackgroundColor('bg-transparent')
      .withPadding('px-3 group-data-icon-left/select:pl-2 group-data-icon-right/select:pr-2')
      .withCursor('disabled:cursor-not-allowed')

      .build(),
    item: new StyleBuilder()
      .withBase('outline-none')
      .withSize('w-full')
      .withCursor('cursor-pointer data-disabled:cursor-not-allowed')
      .withBorderRadius('rounded-sm')
      .withPadding('p-md')
      .withSpacing('not-last:mb-xxs')
      .withFlex('flex items-center justify-between gap-x-md')
      .withFontSize('text-sm')
      .withFontWeight('data-[state=checked]:font-medium')
      .withColor('text-secondary data-disabled:text-disabled')
      .withBackgroundColor('data-[state=checked]:bg-secondary not-data-disabled:data-highlighted:bg-secondary-hover not-data-disabled:hover:bg-secondary-hover')
      .withTransition('not-data-disabled:data-highlighted:data-[state=checked]:brightness-98')
      .build(),
    itemIndicator: new StyleBuilder()
      .withSize('size-4')
      .withColor('text-secondary')
      .build(),
    loader: new StyleBuilder()
      .withBase('pointer-events-none')
      .withBase('shrink-0')
      .withSpacing('mr-3')
      .withSize('size-4')
      .withColor('text-quaternary')
      .build(),
    placeholder: new StyleBuilder()
      .withColor('text-placeholder')
      .withFontSize('text-sm')
      .build(),
    root: new StyleBuilder()
      .withBase('relative group/select overflow-hidden')
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
    searchInput: '',
    separator: new StyleBuilder()
      .withHeight('h-px')
      .withBackgroundColor('bg-quaternary')
      .withSpacing('my-xs')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type SelectStyle = VariantProps<typeof createSelectStyle>
export type CreateSelectStyle = ReturnType<typeof createSelectStyle>
