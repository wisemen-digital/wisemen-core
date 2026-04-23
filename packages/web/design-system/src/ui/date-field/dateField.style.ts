import { tv } from '@/styles/tailwindVariants.lib'

export const createDateFieldStyle = tv({
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
      },
      sm: {
        field: 'gap-xxs text-xs',
      },
    },
  },
})

export type DateFieldStyle = ReturnType<typeof createDateFieldStyle>
