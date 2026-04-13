import { tv } from '@/styles/tailwindVariants.lib'

export const createAvatarGroupStyle = tv({
  slots: {
    avatar: `
      shrink-0 rounded-full shadow-[0px_0px_0px_1.5px_var(--color-white)]
      dark:shadow-[0px_0px_0px_1.5px_var(--color-gray-900)]
    `,
    overflow: `
      z-1 flex shrink-0 items-center justify-center rounded-full border
      border-secondary bg-tertiary font-semibold text-tertiary
      shadow-[0px_0px_0px_1.5px_var(--color-white)]
      dark:shadow-[0px_0px_0px_1.5px_var(--color-gray-900)]
    `,
    root: 'relative flex items-start',
  },
  variants: {
    size: {
      md: {
        avatar: '-mr-3',
        overflow: '-mr-3 size-10 text-md',
        root: 'pr-3',
      },
      sm: {
        avatar: '-mr-2',
        overflow: '-mr-2 size-8 text-sm',
        root: 'pr-2',
      },
      xs: {
        avatar: '-mr-1',
        overflow: '-mr-1 size-6 text-[10px]',
        root: 'pr-1',
      },
    },
  },
})

export type AvatarGroupStyle = ReturnType<typeof createAvatarGroupStyle>
