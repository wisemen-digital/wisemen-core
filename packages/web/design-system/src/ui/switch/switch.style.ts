import { tv } from '@/styles/tailwindVariants.lib'

export const createSwitchStyle = tv({
  defaultVariants: {
    size: 'md',
  },
  slots: {
    root: `
      group/switch relative isolate h-5 w-9 cursor-pointer overflow-hidden
      rounded-full border border-solid border-tertiary bg-tertiary px-xxs
      outline-offset-3 outline-brand-600 duration-200
      disabled:cursor-not-allowed disabled:border-disabled-subtle
      disabled:bg-disabled-subtle
      data-invalid:bg-error-primary data-invalid:outline-error-600
      data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-solid
      disabled:data-[state=checked]:border-disabled-subtle
      disabled:data-[state=checked]:bg-disabled-subtle
      data-invalid:data-[state=checked]:border-error
      data-invalid:data-[state=checked]:bg-error-solid
      data-invalid:data-[state=unchecked]:border-error
      dark:border-primary
    `,
    thumb: `
      flex size-4 items-center justify-center overflow-hidden rounded-full
      bg-white shadow-xs duration-200
      data-[state=checked]:translate-x-[0.9rem]
    `,
    thumbIcon: `
      size-3 text-gray-800
      group-data-[state=checked]/switch:text-brand-600
    `,
  },
})

export type SwitchStyle = ReturnType<typeof createSwitchStyle>
