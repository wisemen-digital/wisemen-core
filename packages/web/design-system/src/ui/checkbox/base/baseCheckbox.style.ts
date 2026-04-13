import { tv } from '@/styles/tailwindVariants.lib'

export const createBaseCheckboxStyle = tv({
  slots: {
    control: `
      relative flex size-4 items-center justify-center overflow-hidden
      rounded-xs border border-solid border-primary outline-2 outline-offset-1
      outline-transparent duration-300
      group-focus-visible/checkbox:outline-brand-600
      group-disabled/checkbox:bg-disabled-subtle
      group-focus-visible/checkbox:group-data-invalid/checkbox:outline-error-600
      group-data-[state=checked]/checkbox:border-brand-600
      group-data-[state=checked]/checkbox:bg-brand-solid
      group-data-[state=checked]/checkbox:group-disabled/checkbox:border-disabled
      group-disabled/checkbox:group-data-[state=checked]/checkbox:bg-disabled-subtle
      group-data-invalid/checkbox:group-data-[state=checked]/checkbox:border-error
      group-data-invalid/checkbox:group-data-[state=checked]/checkbox:bg-error-solid
      group-data-invalid/checkbox:group-data-[state=unchecked]/checkbox:border-error
      disabled:border-disabled
    `,
    indicator: `
      block size-3 text-primary-on-brand
      group-disabled/checkbox:text-fg-disabled-subtle
    `,
    root: `
      group/checkbox flex cursor-pointer items-center justify-start outline-none
      disabled:cursor-not-allowed
    `,
  },
})

export type BaseCheckboxStyle = ReturnType<typeof createBaseCheckboxStyle>
