import { tv } from '@/styles/tailwindVariants.lib'

export const createDateRangeFieldStyle = tv({
  slots: {
    field: `ml-sm flex h-full min-w-0 flex-1 items-center`,
    literal: `text-placeholder select-none`,
    segment: `
      rounded-sm text-primary tabular-nums caret-transparent outline-none
      group-data-disabled/field-wrapper:pointer-events-none
      hover:bg-primary-hover hover:text-primary
      focus:bg-primary-hover focus:text-primary
      data-placeholder:text-placeholder
      data-placeholder:focus:text-primary
    `,
    separator: `
      mt-xxs size-3 shrink-0 text-fg-quaternary select-none
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
    isPickerHidden: {
      false: {
        field: 'pl-xxs',
      },
      true: {
        field: 'pl-md',
      },
    },
    size: {
      md: {
        field: 'gap-xxs text-xs',
        separator: 'mx-xs',
        trigger: 'pr-md pl-xs',
      },
      sm: {
        field: 'gap-xxs text-xs',
        separator: 'mx-xxs',
        trigger: 'pr-sm pl-xxs',
      },
    },
  },
})

export type DateRangeFieldStyle = ReturnType<typeof createDateRangeFieldStyle>
