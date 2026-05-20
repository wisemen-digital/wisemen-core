import { tv } from '@/styles/tailwindVariants.lib'

export const featuredIconVariants = tv({
  compoundVariants: [
    // brand
    {
      class: {
        base: `
          border-brand-200 bg-brand-25
          dark:border-brand-800 dark:bg-brand-950
        `,
        icon: `
          text-brand-700
          dark:text-brand-200
        `,
      },
      color: 'brand',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-brand-25
          dark:bg-brand-950
        `,
        icon: `
          text-brand-700
          dark:text-brand-200
        `,
      },
      color: 'brand',
      variant: 'translucent',
    },

    // error
    {
      class: {
        base: `
          border-error-200 bg-error-25
          dark:border-error-800 dark:bg-error-950
        `,
        icon: `
          text-error-700
          dark:text-error-200
        `,
      },
      color: 'error',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-error-25
          dark:bg-error-950
        `,
        icon: `
          text-error-700
          dark:text-error-200
        `,
      },
      color: 'error',
      variant: 'translucent',
    },

    // gray
    {
      class: {
        base: `
          border-gray-300 bg-gray-25
          dark:border-gray-800 dark:bg-gray-950
        `,
        icon: `
          text-gray-800
          dark:text-gray-400
        `,
      },
      color: 'gray',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-gray-25
          dark:bg-gray-950
        `,
        icon: `
          text-gray-500
          dark:text-gray-400
        `,
      },
      color: 'gray',
      variant: 'translucent',
    },

    // success
    {
      class: {
        base: `
          border-success-200 bg-success-25
          dark:border-success-800 dark:bg-success-950
        `,
        icon: `
          text-success-700
          dark:text-success-200
        `,
      },
      color: 'success',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-success-25
          dark:bg-success-950
        `,
        icon: `
          text-success-700
          dark:text-success-200
        `,
      },
      color: 'success',
      variant: 'translucent',
    },

    // blue
    {
      class: {
        base: `
          border-blue-200 bg-blue-25
          dark:border-blue-800 dark:bg-blue-950
        `,
        icon: `
          text-blue-700
          dark:text-blue-200
        `,
      },
      color: 'blue',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-blue-25
          dark:bg-blue-950
        `,
        icon: `
          text-blue-700
          dark:text-blue-200
        `,
      },
      color: 'blue',
      variant: 'translucent',
    },

    // pink
    {
      class: {
        base: `
          border-pink-200 bg-pink-25
          dark:border-pink-800 dark:bg-pink-950
        `,
        icon: `
          text-pink-700
          dark:text-pink-200
        `,
      },
      color: 'pink',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-pink-25
          dark:bg-pink-950
        `,
        icon: `
          text-pink-700
          dark:text-pink-200
        `,
      },
      color: 'pink',
      variant: 'translucent',
    },

    // purple
    {
      class: {
        base: `
          border-purple-200 bg-purple-25
          dark:border-purple-800 dark:bg-purple-950
        `,
        icon: `
          text-purple-700
          dark:text-purple-200
        `,
      },
      color: 'purple',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-purple-25
          dark:bg-purple-950
        `,
        icon: `
          text-purple-700
          dark:text-purple-200
        `,
      },
      color: 'purple',
      variant: 'translucent',
    },

    // warning
    {
      class: {
        base: `
          border-warning-200 bg-warning-25
          dark:border-warning-800 dark:bg-warning-950
        `,
        icon: `
          text-warning-700
          dark:text-warning-200
        `,
      },
      color: 'warning',
      variant: 'outline',
    },
    {
      class: {
        base: `
          border-transparent bg-warning-25
          dark:bg-warning-950
        `,
        icon: `
          text-warning-700
          dark:text-warning-200
        `,
      },
      color: 'warning',
      variant: 'translucent',
    },
  ],
  slots: {
    base: 'inline-flex shrink-0 items-center justify-center border',
    icon: '',
  },
  variants: {
    color: {
      blue: {},
      brand: {},
      error: {},
      gray: {},
      pink: {},
      purple: {},
      success: {},
      warning: {},
    },

    size: {
      '2xl': {
        base: 'size-16.25 rounded-2xl',
        icon: 'size-8',
      },
      'lg': {
        base: 'size-10 rounded-xl',
        icon: 'size-5',
      },
      'md': {
        base: 'size-7.5 rounded-lg',
        icon: 'size-4',
      },
      'sm': {
        base: 'size-6 rounded-lg',
        icon: 'size-4',
      },
      'xl': {
        base: 'size-12 rounded-xl',
        icon: 'size-6',
      },
    },

    variant: {
      outline: {},
      translucent: {},
    },
  },
})

export type FeaturedIconVariants = ReturnType<typeof featuredIconVariants>
