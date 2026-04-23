import { tv } from '@/styles/tailwindVariants.lib'

export const createDateRangeFieldStyle = tv({
  slots: {
    field: `flex h-full min-w-0 flex-1 items-center`,
    literal: `text-placeholder select-none`,
    segment: `
      rounded-sm px-xxs text-primary tabular-nums caret-transparent outline-none
      group-data-disabled/field-wrapper:pointer-events-none
      focus:bg-brand-solid focus:text-primary-on-brand
      data-placeholder:text-placeholder
      data-placeholder:focus:text-primary-on-brand
    `,
    separator: `
      shrink-0 text-fg-quaternary select-none
      group-data-disabled/field-wrapper:text-fg-disabled-subtle
    `,
    trigger: `
      mr-sm flex aspect-square size-4 shrink-0 cursor-pointer items-center
      justify-center bg-transparent p-sm
      focus-visible:outline-fg-brand-primary
      disabled:cursor-not-allowed
    `,
  },
  variants: {
    size: {
      md: {
        field: 'gap-xxs pl-md text-xs',
        separator: 'mx-xs',
        trigger: 'pr-md pl-xs',
      },
      sm: {
        field: 'gap-xxs pl-sm text-xs',
        separator: 'mx-xxs',
        trigger: 'pr-sm pl-xxs',
      },
    },
  },
})

export type DateRangeFieldStyle = ReturnType<typeof createDateRangeFieldStyle>
