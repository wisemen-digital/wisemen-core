import { tv } from '@/styles/tailwindVariants.lib'

export const createBaseRadioGroupStyle = tv({
  slots: {
    cardRoot: `
      group/radio-group-item flex cursor-pointer items-center justify-start
      rounded-md border border-secondary p-lg outline-none
      disabled:cursor-not-allowed
      data-active:border-brand-600
    `,
    control: `
      relative mt-px flex size-4 items-center justify-center overflow-hidden
      rounded-full border border-solid border-primary outline-2 outline-offset-1
      outline-transparent duration-300
      group-focus-visible/radio-group-item:outline-brand-600
      group-disabled/radio-group-item:bg-disabled-subtle
      group-data-active/radio-group-item:border-brand-600
      group-data-active/radio-group-item:bg-brand-solid
      group-data-active/radio-group-item:group-disabled/radio-group-item:border-disabled
      group-disabled/radio-group-item:group-data-active/radio-group-item:bg-disabled-subtle
      group-data-invalid/radio-group-item:not-group-data-active/radio-group-item:border-error
      group-focus-visible/radio-group-item:group-data-invalid/radio-group-item:outline-error-600
      group-data-invalid/radio-group-item:group-data-active/radio-group-item:border-error
      group-data-invalid/radio-group-item:group-data-active/radio-group-item:bg-error-solid
      disabled:border-disabled
    `,
    description: `text-xs text-tertiary`,
    indicator: `
      block size-1.5 rounded-full bg-white
      group-disabled/radio-group-item:bg-fg-disabled-subtle
    `,
    label: `text-xs font-medium text-primary`,
    root: `
      group/radio-group-item flex cursor-pointer items-center justify-start
      gap-x-sm outline-none
      disabled:cursor-not-allowed
    `,
  },
})

export type BaseRadioGroupStyle = ReturnType<typeof createBaseRadioGroupStyle>
