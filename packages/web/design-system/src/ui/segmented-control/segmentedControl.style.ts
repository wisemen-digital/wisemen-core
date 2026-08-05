import { tv } from '@/libs/tailwindVariants.lib'

const segmentedControlSharedLabel = 'text-sm font-medium whitespace-nowrap'

const segmentedControlSharedList = `
  flex items-stretch gap-none rounded-xl bg-tertiary/60 p-xxs
  data-[orientation=vertical]:flex-col
`

const segmentedControlSharedVariants = {
  hasDescription: {
    true: {
      item: 'h-auto min-h-14 items-center px-lg py-sm text-left',
    },
  },
  isDescriptionCentered: {
    true: {
      item: 'text-center',
    },
  },
  size: {
    md: {
      item: 'h-8',
    },
    sm: {
      item: 'h-7',
    },
  },
} as const

export const createSegmentedControlStyle = tv({
  slots: {
    description: `
      text-xs text-quaternary
      group-data-active/segmented-control-item:text-brand-secondary
    `,
    indicator: `
      absolute z-0 duration-200
      group-data-[orientation=horizontal]:top-0.5
      group-data-[orientation=horizontal]:left-0
      group-data-[orientation=horizontal]:h-(--segmented-control-indicator-cross-size)
      group-data-[orientation=horizontal]:w-(--segmented-control-indicator-size)
      group-data-[orientation=horizontal]:translate-x-(--segmented-control-indicator-position)
      group-data-[orientation=vertical]:top-0
      group-data-[orientation=vertical]:left-0.5
      group-data-[orientation=vertical]:h-(--segmented-control-indicator-size)
      group-data-[orientation=vertical]:w-(--segmented-control-indicator-cross-size)
      group-data-[orientation=vertical]:translate-y-(--segmented-control-indicator-position)
    `,
    indicatorInner: 'absolute inset-0.5 block rounded-lg bg-primary shadow-sm',
    item: `
      group/segmented-control-item relative z-10 flex items-center
      justify-center rounded-lg px-lg text-sm font-medium text-quaternary
      outline-2 outline-transparent duration-200
      after:absolute after:inset-y-1.5 after:right-0 after:w-px
      after:bg-quaternary after:opacity-100 after:duration-200
      after:content-['']
      not-has-[+[role=radio]]:after:hidden
      not-disabled:hover:text-secondary
      focus-visible:outline-fg-brand-primary-alt
      disabled:cursor-not-allowed disabled:opacity-75
      has-[+[data-active]]:after:opacity-0
      data-active:text-secondary
      data-active:after:opacity-0
      data-[orientation=vertical]:w-full
      data-[orientation=vertical]:after:inset-x-1.5
      data-[orientation=vertical]:after:inset-y-auto
      data-[orientation=vertical]:after:right-auto
      data-[orientation=vertical]:after:bottom-0
      data-[orientation=vertical]:after:h-px
      data-[orientation=vertical]:after:w-auto
      dark:after:bg-tertiary
    `,
    label: segmentedControlSharedLabel,
    list: `
      group relative
      ${segmentedControlSharedList}
    `,
  },
  variants: segmentedControlSharedVariants,
})

export type SegmentedControlStyle = ReturnType<typeof createSegmentedControlStyle>

export const createSegmentedControlGroupStyle = tv({
  slots: {
    description: `
      text-xs text-quaternary
      group-aria-checked/segmented-control-item:text-brand-secondary
    `,
    item: `
      group/segmented-control-item relative z-10 flex flex-1 items-center
      justify-center rounded-lg px-lg text-sm font-medium text-quaternary
      outline-2 outline-transparent duration-200
      before:absolute before:inset-0.5 before:-z-1 before:rounded-lg
      before:bg-primary before:opacity-0 before:shadow-sm before:duration-200
      before:content-['']
      after:absolute after:inset-y-1.5 after:right-0 after:w-px
      after:bg-quaternary after:opacity-100 after:duration-200
      after:content-['']
      not-has-[+[role=checkbox]]:after:hidden
      not-disabled:not-aria-checked:hover:bg-primary-hover
      not-disabled:not-aria-checked:hover:text-secondary
      focus-visible:outline-fg-brand-primary-alt
      disabled:cursor-not-allowed disabled:opacity-75
      has-[+[aria-checked=true]]:after:opacity-0
      aria-checked:text-secondary
      aria-checked:before:opacity-100
      aria-checked:after:opacity-0
      data-[orientation=vertical]:w-full
      data-[orientation=vertical]:after:inset-x-1.5
      data-[orientation=vertical]:after:inset-y-auto
      data-[orientation=vertical]:after:right-auto
      data-[orientation=vertical]:after:bottom-0
      data-[orientation=vertical]:after:h-px
      data-[orientation=vertical]:after:w-auto
      dark:after:bg-tertiary
    `,
    label: segmentedControlSharedLabel,
    list: segmentedControlSharedList,
  },
  variants: segmentedControlSharedVariants,
})

export type SegmentedControlGroupStyle = ReturnType<typeof createSegmentedControlGroupStyle>
