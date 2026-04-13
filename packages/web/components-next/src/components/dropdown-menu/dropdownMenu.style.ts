import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createDropdownMenuStyle = tv({
  slots: {
    arrow: new StyleBuilder()
      .withClasses('absolute left-1/2 rotate-45')
      .withSize('size-4')
      .withTranslate('-translate-x-1/2 -translate-y-3')
      .withBorderRadius('rounded-xxs')
      .withBackgroundColor('bg-primary')
      .withBorder('border border-solid border-secondary')
      .withShadow('shadow-lg')
      .build(),
    content: new StyleBuilder()
      .withBase('data-[content-width=anchor-width]:w-(--reka-dropdown-menu-trigger-width) data-[content-width=available-width]:w-(--reka-dropdown-menu-content-available-width)')
      .withZIndex('z-40')
      .withBackgroundColor('bg-primary')
      .withBorder('border border-solid border-secondary')
      .withBorderRadius('rounded-lg')
      .withBase('relative')
      .withSize('size-full min-w-52')
      .withBorderRadius('rounded-lg')
      .withShadow('shadow-lg')
      .build(),
    group: new StyleBuilder()
      .withPadding('p-xs')
      .build(),
    item: new StyleBuilder()
      .withBase('group/dropdown-menu-item outline-none')
      .withSize('w-full')
      .withGrid('grid grid-cols-[auto_1fr_auto] items-center')
      .withCursor('cursor-pointer data-disabled:cursor-not-allowed')
      .withBorderRadius('rounded-sm')
      .withPadding('p-md')
      .withBackgroundColor('not-data-disabled:data-highlighted:bg-secondary-hover not-data-disabled:data-destructive:data-highlighted:bg-error-primary')
      .withTransition('duration-200')
      .build(),
    itemIcon: new StyleBuilder()
      .withSize('size-4')
      .withColor('text-secondary group-data-disabled/dropdown-menu-item:text-disabled group-data-destructive/dropdown-menu-item:text-error-primary')
      .withSpacing('mr-md')
      .withTransition('duration-200')
      .build(),
    itemLabel: new StyleBuilder()
      .withColor('text-secondary font-medium group-data-disabled/dropdown-menu-item:text-disabled group-data-destructive/dropdown-menu-item:text-error-primary')
      .withFontSize('text-sm')
      .withTransition('duration-200')
      .build(),
    label: new StyleBuilder()
      .withColor('text-tertiary')
      .withFontSize('text-sm')
      .withFontWeight('font-medium')
      .build(),
    separator: new StyleBuilder()
      .withHeight('h-px')
      .withBackgroundColor('bg-quaternary')
      .build(),
    subMenuArrowIcon: new StyleBuilder()
      .withSize('size-4')
      .withColor('text-quaternary')
      .build(),
  },
  variants: {
    variant: {},
  },
})

export type DropdownMenuStyle = VariantProps<typeof createDropdownMenuStyle>
export type CreateDropdownMenuStyle = ReturnType<typeof createDropdownMenuStyle>
