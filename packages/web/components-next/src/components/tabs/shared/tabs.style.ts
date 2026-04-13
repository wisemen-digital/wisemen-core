import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'
import { StyleBuilder } from '@/utils/style-builder/styleBuilder.util'

export const createTabsStyle = tv({
  slots: {
    base: new StyleBuilder()
      .withBase('relative isolate overflow-hidden')
      .build(),
    content: new StyleBuilder()
      .withBase('outline-none')
      .build(),
    indicator: new StyleBuilder()
      .withBase('absolute group-data-[orientation=horizontal]:bottom-0 group-data-[orientation=vertical]:left-0')
      .withSize('group-data-[orientation=horizontal]:w-(--reka-tabs-indicator-size) group-data-[orientation=vertical]:h-(--reka-tabs-indicator-size)')
      .withTranslate('group-data-[orientation=horizontal]:translate-x-(--reka-tabs-indicator-position) group-data-[orientation=vertical]:translate-y-(--reka-tabs-indicator-position)')
      .withTransition('duration-200')
      .build(),
    item: new StyleBuilder()
      .withBase('group/tabs-item relative data-[orientation=vertical]:text-left whitespace-nowrap')
      .withFontSize('text-sm')
      .withFontWeight('font-semibold')
      .withTransition('duration-200')
      .withCursor('cursor-pointer disabled:cursor-not-allowed')
      .withZIndex('z-10')
      .build(),
    list: new StyleBuilder()
      .withBase('group relative flex data-[orientation=vertical]:flex-col')
      .build(),
    scrollContainer: new StyleBuilder()
      .withBase('overflow-x-auto no-scrollbar scroll-smooth')
      .build(),
  },
  variants: {
    variant: {
      'button-border': {
        base: new StyleBuilder()
          .withBackgroundColor('bg-secondary-alt')
          .withBorder('border border-secondary')
          .withBorderRadius('rounded-lg')
          .build(),
        indicator: new StyleBuilder()
          .withBackgroundColor('bg-primary-alt')
          .withBorderRadius('rounded-sm')
          .withSize('group-data-[orientation=horizontal]:h-full group-data-[orientation=vertical]:w-full')
          .withShadow('shadow-xs')
          .build(),
        item: new StyleBuilder()
          .withOutline('outline-2 outline-transparent focus-visible:outline-fg-brand-primary-alt')
          .withColor('data-[state=active]:text-secondary data-[state=inactive]:text-quaternary not-disabled:data-[state=inactive]:hover:text-tertiary disabled:opacity-75')
          .withSpacing('py-md px-lg')
          .withBorderRadius('rounded-sm')
          .build(),
        list: new StyleBuilder()
          .withSpacing('gap-xs')
          .build(),
        scrollContainer: new StyleBuilder()
          .withSpacing('p-xs')
          .build(),
      },
      'button-brand': {
        indicator: new StyleBuilder()
          .withSize('group-data-[orientation=horizontal]:h-full group-data-[orientation=vertical]:w-full')
          .withBorderRadius('rounded-sm')
          .withBackgroundColor('bg-brand-primary-alt')
          .build(),
        item: new StyleBuilder()
          .withColor('data-[state=active]:text-brand-secondary data-[state=inactive]:text-quaternary not-disabled:data-[state=inactive]:hover:text-tertiary disabled:opacity-75')
          .withOutline('outline-2 outline-transparent focus-visible:outline-fg-brand-primary-alt')
          .withBorderRadius('rounded-sm')
          .withSpacing('py-md px-lg')
          .build(),
        list: new StyleBuilder()
          .withSpacing('gap-xs')
          .build(),
      },
      'underline': {
        indicator: new StyleBuilder()
          .withSize('group-data-[orientation=horizontal]:h-0.5 group-data-[orientation=vertical]:w-0.5')
          .withBackgroundColor('bg-fg-brand-primary-alt')
          .withBorderRadius('rounded-md')
          .build(),
        item: new StyleBuilder()
          .withPadding('px-md py-sm')
          .withMargin('group-data-[orientation=horizontal]:my-sm group-data-[orientation=vertical]:mx-sm')
          .withBorderRadius('rounded-md')
          .withOutline('outline-2 outline-transparent focus-visible:outline-fg-brand-primary-alt')
          .withColor('data-[state=active]:text-brand-secondary data-[state=inactive]:text-quaternary disabled:opacity-75')
          .withBackgroundColor('not-disabled:hover:bg-primary-hover not-disabled:data-[state=active]:hover:bg-brand-primary-alt')
          .build(),
        list: new StyleBuilder()
          .withSpacing('gap-lg')
          .build(),
      },
    },
  },
})

export type TabsStyle = VariantProps<typeof createTabsStyle>
export type CreateTabsStyle = ReturnType<typeof createTabsStyle>
