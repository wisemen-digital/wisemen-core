import { tv } from '@/styles/tailwindVariants.lib'

export const createTimeFieldStyle = tv({
  slots: {
    field: 'flex h-full flex-1 items-center',
    literal: 'text-placeholder select-none',
    segment: `
      rounded-xs px-xxs text-primary tabular-nums caret-transparent outline-none
      group-data-disabled/field-wrapper:pointer-events-none
      hover:bg-secondary-hover hover:text-primary
      focus:bg-secondary-hover focus:text-primary
      data-placeholder:text-placeholder
      data-placeholder:focus:text-primary
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
