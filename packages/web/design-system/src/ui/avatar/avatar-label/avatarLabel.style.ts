import { tv } from '@/styles/tailwindVariants.lib'

export const createAvatarLabelStyle = tv({
  slots: {
    name: 'font-semibold text-primary',
    root: 'flex min-w-0 items-center',
    supportingText: 'text-tertiary',
    textContainer: 'min-w-0',
  },
  variants: {
    size: {
      '2xl': {
        name: 'text-lg',
        root: 'gap-xl',
        supportingText: 'text-md',
      },
      'lg': {
        name: 'text-md',
        root: 'gap-lg',
        supportingText: 'text-md',
      },
      'md': {
        name: 'text-sm',
        root: 'gap-md',
        supportingText: 'text-sm',
      },
      'sm': {
        name: 'text-sm',
        root: 'gap-md',
        supportingText: 'text-xs',
      },
      'xl': {
        name: 'text-lg',
        root: 'gap-xl',
        supportingText: 'text-md',
      },
      'xs': {
        name: 'text-xs',
        root: 'gap-md',
        supportingText: 'text-xs',
      },
    },
  },
})

export type AvatarLabelStyle = ReturnType<typeof createAvatarLabelStyle>
