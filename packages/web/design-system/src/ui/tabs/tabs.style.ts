import { tv } from 'tailwind-variants'

export const tabsVariants = tv({
  compoundVariants: [
    {
      isFullWidth: true,
      class: {
        list: 'w-auto',
      },
      variant: 'button-border',
    },
  ],
  slots: {
    base: 'relative isolate overflow-hidden',
    content: 'outline-none',
    indicator: `
      absolute duration-200
      group-data-[orientation=horizontal]:bottom-0
      group-data-[orientation=horizontal]:w-(--reka-tabs-indicator-size)
      group-data-[orientation=horizontal]:translate-x-(--reka-tabs-indicator-position)
      group-data-[orientation=vertical]:left-0
      group-data-[orientation=vertical]:h-(--reka-tabs-indicator-size)
      group-data-[orientation=vertical]:translate-y-(--reka-tabs-indicator-position)
    `,
    indicatorInner: 'hidden',
    item: `
      group/tabs-item relative z-10 flex items-center gap-sm text-sm
      font-semibold whitespace-nowrap duration-200
      disabled:cursor-not-allowed
      data-[orientation=vertical]:text-left
    `,
    list: `
      group relative flex
      data-[orientation=vertical]:flex-col
    `,
    scrollButton: `
      flex size-7 shrink-0 items-center justify-center rounded-md bg-primary
      text-secondary
      hover:bg-primary-hover
    `,
    scrollContainer: 'no-scrollbar overflow-x-auto scroll-smooth',
    scrollEdge: `
      absolute top-0 z-20 flex h-full w-12 items-center from-primary
      to-transparent
    `,
  },
  variants: {
    underlineTabsHorizontalListPadding: {
      lg: {
        scrollContainer: 'px-2xl',
      },
      md: {
        scrollContainer: 'px-xl',
      },
      none: {
        scrollContainer: 'px-0',
      },
      sm: {
        scrollContainer: 'px-lg',
      },
      xl: {
        scrollContainer: 'px-4xl',
      },
    },
    isFullWidth: {
      true: {
        item: 'flex-1 justify-center',
      },
    },
    variant: {
      'button-border': {
        base: 'rounded-lg',
        indicator: `
          group-data-[orientation=horizontal]:h-full
          group-data-[orientation=vertical]:w-full
        `,
        indicatorInner: `
          absolute inset-1 block rounded-sm bg-primary shadow-sm outline-2
          outline-transparent
          group-has-focus-visible:outline-fg-brand-primary-alt
        `,
        item: `
          rounded-sm px-lg py-sm outline-none
          disabled:opacity-75
          data-[state=active]:text-secondary
          data-[state=inactive]:text-quaternary
          not-disabled:data-[state=inactive]:hover:text-tertiary
        `,
        list: `relative w-fit gap-xs rounded-sm bg-tertiary/60`,
      },
      'button-brand': {
        indicator: `
          group-data-[orientation=horizontal]:h-full
          group-data-[orientation=vertical]:w-full
        `,
        indicatorInner: 'block size-full rounded-sm bg-brand-primary-alt',
        item: `
          rounded-sm px-lg py-xs outline-2 outline-transparent
          focus-visible:outline-fg-brand-primary-alt
          disabled:opacity-75
          data-[state=active]:text-brand-secondary
          data-[state=inactive]:text-quaternary
          not-disabled:data-[state=inactive]:hover:text-tertiary
        `,
        list: 'gap-xs',
      },
      'underline': {
        indicator: `
          rounded-md bg-fg-brand-primary-alt
          group-data-[orientation=horizontal]:h-0.5
          group-data-[orientation=vertical]:w-0.5
        `,
        item: `
          rounded-md px-md py-xxs outline-2 -outline-offset-2
          outline-transparent
          group-data-[orientation=horizontal]:my-sm
          group-data-[orientation=vertical]:mx-sm
          not-disabled:hover:bg-primary-hover
          focus-visible:outline-fg-brand-primary-alt
          disabled:opacity-75
          data-[state=active]:text-brand-secondary
          not-disabled:data-[state=active]:hover:bg-brand-primary-alt
          data-[state=inactive]:text-quaternary
        `,
        list: `
          gap-lg
          data-[orientation=vertical]:gap-sm
        `,
        scrollContainer: `
          border-secondary
          data-[orientation=horizontal]:border-b
          data-[orientation=vertical]:border-l
        `,
      },
    },
  },
})

export type TabsVariants = ReturnType<typeof tabsVariants>
