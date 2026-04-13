import { tv } from '@/styles/tailwindVariants.lib'

export const createAvatarStyle = tv({
  slots: {
    base: `
      aspect-square shrink-0 rounded-full border border-secondary object-cover
    `,
    fallBack: `
      flex aspect-square size-6 shrink-0 items-center justify-center
      rounded-full border border-secondary bg-tertiary text-xs font-semibold
      text-quaternary
    `,
    logo: `
      absolute right-0 bottom-0 rounded-full object-cover ring-2 ring-white
      dark:ring-gray-900
    `,
    root: 'relative inline-block shrink-0',
    statusDot: `
      absolute right-0 bottom-0 rounded-full ring-2 ring-white
      dark:ring-gray-900
    `,
  },
  variants: {
    size: {
      '2xl': {
        base: 'h-16 w-16 text-2xl',
        fallBack: 'h-16 w-16 text-2xl',
        logo: 'size-4',
        statusDot: 'size-4',
      },
      'lg': {
        base: 'h-12 w-12 text-lg',
        fallBack: 'h-12 w-12 text-lg',
        logo: 'size-3.5',
        statusDot: 'size-3.5',
      },
      'md': {
        base: 'h-10 w-10 text-md',
        fallBack: 'h-10 w-10 text-md',
        logo: 'size-3',
        statusDot: 'size-3',
      },
      'sm': {
        base: 'h-8 w-8 text-sm',
        fallBack: 'h-8 w-8 text-sm',
        logo: 'size-2.5',
        statusDot: 'size-2.5',
      },
      'xl': {
        base: 'h-14 w-14 text-xl',
        fallBack: 'h-14 w-14 text-xl',
        logo: 'size-3.5',
        statusDot: 'size-3.5',
      },
      'xs': {
        base: 'h-6 w-6 text-xxs',
        fallBack: 'h-6 w-6 text-xxs',
        logo: 'size-2',
        statusDot: 'size-2',
      },
    },
    status: {
      away: {
        statusDot: 'bg-warning-500',
      },
      busy: {
        statusDot: 'bg-error-500',
      },
      offline: {
        statusDot: 'bg-gray-400',
      },
      online: {
        statusDot: 'bg-success-500',
      },
    },
  },
})

export type AvatarStyle = ReturnType<typeof createAvatarStyle>
