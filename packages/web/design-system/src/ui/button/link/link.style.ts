import { tv } from '@/styles/tailwindVariants.lib'

export const createLinkStyle = tv({
  compoundVariants: [
    {
      class: {
        container: 'dark:rounded-[0.31rem] dark:px-md',
      },
      size: 'md',
      variant: 'primary',
    },
    {
      class: {
        container: 'dark:rounded-[0.44rem] dark:px-lg',
      },
      size: 'lg',
      variant: 'primary',
    },
    {
      class: {
        container: 'dark:rounded-[0.19rem] dark:px-sm',
      },
      size: 'sm',
      variant: 'primary',
    },
    {
      class: {
        container: `dark:rounded-[0.06rem] dark:px-xs`,
      },
      size: 'xs',
      variant: 'primary',
    },
  ],
  slots: {
    container: `grid size-full [grid-template-areas:'stack']`,
    icon: `shrink-0`,
    label: `font-medium`,
    root: `
      group/link inline-flex shrink-0 cursor-pointer items-center justify-center
      border outline-2 outline-offset-1 outline-transparent duration-100
    `,
    rowLayout: `
      duration-100 [grid-area:stack]
      group-active/link:scale-98
    `,
  },
  variants: {
    size: {
      lg: {
        icon: `size-4`,
        label: `text-sm`,
        root: 'h-8 min-w-8 rounded-lg px-lg',
      },
      md: {
        icon: `size-3.5`,
        label: `text-xs`,
        root: 'h-7 min-w-7 rounded-md px-md',
      },
      sm: {
        icon: `size-3.5`,
        label: `text-xs`,
        root: 'h-6 min-w-6 rounded-sm px-sm',
      },
      xs: {
        icon: `size-3.5`,
        label: `text-xs`,
        root: 'h-5.5 min-w-5.5 rounded-xs px-xs',
      },
    },
    variant: {
      'destructive-primary': {
        icon: `text-white`,
        label: `text-white`,
        root: `
          border-error-600 bg-error-solid
          hover:brightness-95
          focus-visible:outline-fg-error-primary
        `,
      },
      'destructive-tertiary': {
        icon: `text-error-primary`,
        label: `
          text-error-primary
          dark:text-error-700
        `,
        root: `
          border-transparent
          hover:bg-error-50
          focus-visible:outline-fg-error-primary
          dark:hover:bg-error-700/20
        `,
      },
      'primary': {
        container: `dark:glassy-inner-content`,
        icon: `text-primary-on-brand`,
        label: `text-primary-on-brand`,
        root: `
          border-brand-600 bg-brand-solid
          hover:brightness-95
          focus-visible:outline-fg-brand-primary
          dark:border-none dark:p-px dark:glassy
        `,
      },
      'secondary': {
        icon: `text-secondary`,
        label: `text-secondary`,
        root: `
          border-secondary bg-primary
          hover:bg-primary-hover
          focus-visible:outline-fg-brand-primary
          dark:border-primary
        `,
      },
      'tertiary': {
        icon: `text-secondary`,
        label: `text-secondary`,
        root: `
          border-transparent
          hover:bg-secondary-hover
          focus-visible:outline-fg-brand-primary
        `,
      },
    },

  },
})

export type LinkStyle = ReturnType<typeof createLinkStyle>
