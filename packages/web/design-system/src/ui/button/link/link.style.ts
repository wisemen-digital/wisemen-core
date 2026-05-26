import { tv } from '@/libs/tailwindVariants.lib'

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
    label: `truncate font-medium`,
    root: `
      group/link inline-flex shrink-0 cursor-pointer items-center justify-center
      border outline-2 outline-offset-1 outline-transparent duration-100
    `,
    rowLayout: `
      flex items-center justify-center overflow-hidden duration-100
      [grid-area:stack]
      group-active/link:scale-98 group-active/link:will-change-transform
    `,
  },
  variants: {
    size: {
      lg: {
        icon: `size-4`,
        label: `text-sm`,
        root: 'h-8 min-w-8 rounded-lg px-lg',
        rowLayout: 'gap-sm',
      },
      md: {
        icon: `size-3.5`,
        label: `text-xs`,
        root: 'h-7 min-w-7 rounded-md px-md',
        rowLayout: 'gap-sm',
      },
      sm: {
        icon: `size-3.5`,
        label: `text-xs`,
        root: 'h-6 min-w-6 rounded-sm px-sm',
        rowLayout: 'gap-xs',
      },
      xs: {
        icon: `size-3.5`,
        label: `text-xs`,
        root: 'h-5.5 min-w-5.5 rounded-sm px-xs',
        rowLayout: 'gap-xs',
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
        icon: `
          text-primary-on-brand
          dark:text-white
        `,
        label: `
          text-primary-on-brand
          dark:text-white
        `,
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
          dark:border-secondary
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
