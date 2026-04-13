import { tv } from '@/styles/tailwindVariants.lib'

export const createAvatarGroupAddButtonStyle = tv({
  slots: {
    icon: `
      text-tertiary
      group-disabled/button:text-disabled
    `,

    root: `
      group/button flex cursor-pointer items-center justify-center rounded-full
      border border-dashed border-primary bg-primary outline-2
      outline-transparent transition-all duration-200
      hover:bg-secondary
      focus-visible:outline-fg-brand-primary
      active:scale-95 active:bg-secondary
      disabled:cursor-not-allowed disabled:border-disabled-subtle
      disabled:bg-disabled
    `,
  },
  variants: {
    size: {
      md: {
        icon: 'size-5',
        root: 'size-10',
      },
      sm: {
        icon: 'size-4',
        root: 'size-8',
      },
      xs: {
        icon: 'size-4',
        root: 'size-6',
      },
    },
  },
})

export type AvatarGroupAddButtonStyle = ReturnType<typeof createAvatarGroupAddButtonStyle>
