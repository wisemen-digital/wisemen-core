import { tv } from '@/libs/tailwindVariants.lib'

export const createDateFieldStyle = tv({
  slots: {
    field: `flex h-full flex-1 items-center px-sm`,
    literal: `text-placeholder select-none`,
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
        field: 'text-xs',
      },
      sm: {
        field: 'text-xs',
      },
    },
  },
})

export type DateFieldStyle = ReturnType<typeof createDateFieldStyle>
