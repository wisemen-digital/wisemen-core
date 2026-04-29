import { tv } from '@/styles/tailwindVariants.lib'

export const createIconButtonStyle = tv({
  compoundVariants: [
    {
      class: {
        container: 'dark:rounded-[0.31rem]',
      },
      size: 'md',
      variant: 'primary',
    },
    {
      class: {
        container: 'dark:rounded-[0.44rem]',
      },
      size: 'lg',
      variant: 'primary',
    },
    {
      class: {
        container: 'dark:rounded-[0.19rem]',
      },
      size: 'sm',
      variant: 'primary',
    },
    {
      class: {
        container: `dark:rounded-[0.06rem]`,
      },
      size: 'xs',
      variant: 'primary',
    },
  ],
  slots: {
    container: `
      grid size-full items-center justify-center [grid-template-areas:'stack']
    `,
    icon: `shrink-0`,
    loader: `mx-auto duration-100 [grid-area:stack]`,
    root: `
      group/button shrink-0 cursor-pointer items-center justify-center border
      outline-2 outline-offset-1 outline-transparent duration-100
      not-data-interactive:cursor-not-allowed
    `,
    rowLayout: `
      duration-100 [grid-area:stack]
      group-not-disabled/button:group-active/button:scale-98
    `,
  },
  variants: {
    isLoading: {
      false: {
        loader: `invisible opacity-0`,
        rowLayout: `opacity-100`,
      },
      true: {
        loader: `opacity-100`,
        rowLayout: `invisible opacity-0`,
      },
    },
    size: {
      lg: {
        icon: `size-4`,
        loader: `size-4`,
        root: 'size-8 rounded-lg',
      },
      md: {
        icon: `size-3.5`,
        loader: `size-3.5`,
        root: 'size-7 rounded-md',
      },
      sm: {
        icon: `size-3.5`,
        loader: `size-3.5`,
        root: 'size-6 rounded-sm',
      },
      xs: {
        icon: `size-3.5`,
        loader: `size-3.5`,
        root: 'size-5.5 rounded-xs',
      },
    },
    variant: {
      'destructive-primary': {
        icon: `
          text-white
          group-disabled/button:text-disabled
        `,
        loader: `
          text-white
          group-disabled/button:text-disabled
        `,
        root: `
          border-error-600 bg-error-solid
          focus-visible:outline-fg-error-primary
          disabled:border-disabled-subtle disabled:bg-disabled
          data-interactive:hover:brightness-95
        `,
      },
      'destructive-tertiary': {
        icon: `
          text-error-primary
          group-disabled/button:text-disabled
        `,
        loader: `
          text-error-primary
          group-disabled/button:text-disabled
        `,
        root: `
          border-transparent
          focus-visible:outline-fg-error-primary
          data-interactive:hover:bg-error-50
          dark:data-interactive:hover:bg-error-700/20
        `,
      },
      'primary': {
        container: `dark:glassy-inner-content`,
        icon: `
          text-primary-on-brand
          group-disabled/button:text-disabled
        `,
        loader: `
          text-primary-on-brand
          group-disabled/button:text-disabled
        `,
        root: `
          border-brand-600 bg-brand-solid
          focus-visible:outline-fg-brand-primary
          disabled:border-disabled-subtle disabled:bg-disabled
          data-interactive:hover:brightness-95
          dark:border-none dark:p-px
          not-data-disabled:dark:glassy
        `,
      },
      'secondary': {
        icon: `
          text-secondary
          group-disabled/button:text-disabled
        `,
        loader: `
          text-secondary
          group-disabled/button:text-disabled
        `,
        root: `
          border-secondary bg-primary
          focus-visible:outline-fg-brand-primary
          disabled:border-disabled-subtle disabled:bg-disabled
          data-interactive:hover:bg-primary-hover
          dark:border-primary
        `,
      },
      'tertiary': {
        icon: `
          text-secondary
          group-disabled/button:text-disabled
        `,
        loader: `
          text-secondary
          group-disabled/button:text-disabled
        `,
        root: `
          border-transparent
          focus-visible:outline-fg-brand-primary
          data-interactive:hover:bg-secondary-hover
        `,
      },
    },

  },
})

export type IconButtonStyle = ReturnType<typeof createIconButtonStyle>
