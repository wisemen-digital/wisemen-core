import { tv } from '@/styles/tailwindVariants.lib'

export const createTimeFieldStyle = tv({
  slots: {
    field: 'flex h-full flex-1 items-center',
    literal: 'text-placeholder select-none',
    segment: `
      rounded-xs px-xxs text-primary tabular-nums caret-transparent duration-100
      outline-none
      group-data-disabled/field-wrapper:pointer-events-none
      not-data-readonly:hover:bg-secondary-hover
      not-data-readonly:hover:text-primary
      not-data-readonly:focus:bg-secondary-hover
      not-data-readonly:focus:text-primary
      data-placeholder:text-placeholder
      focus:data-placeholder:text-primary
      disabled:data-placeholder:text-fg-disabled-subtle
      data-readonly:cursor-default
    `,
  },
  variants: {
    size: {
      md: {
        field: 'pl-md text-xs',
      },
      sm: {
        field: 'pl-sm text-xs',
      },
    },
  },
})

export type TimeFieldStyle = ReturnType<typeof createTimeFieldStyle>
