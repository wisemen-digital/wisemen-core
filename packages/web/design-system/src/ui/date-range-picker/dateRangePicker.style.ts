import { tv } from '@/styles/tailwindVariants.lib'

export const createDateRangePickerStyle = tv({
  slots: {
    trigger: `
      flex size-full min-w-0 cursor-pointer items-center bg-transparent text-xs
      text-primary outline-none
      disabled:cursor-not-allowed disabled:text-disabled
      data-placeholder:text-placeholder
    `,
  },
  variants: {
    size: {
      md: {
        trigger: 'gap-sm px-md',
      },
      sm: {
        trigger: 'gap-xxs px-sm',
      },
    },
  },
})

export type DateRangePickerStyle = ReturnType<typeof createDateRangePickerStyle>
