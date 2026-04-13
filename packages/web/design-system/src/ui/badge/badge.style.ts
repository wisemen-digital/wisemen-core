// badge.variants.ts

import { tv } from '@/styles/tailwindVariants.lib'

export const badgeVariants = tv({
  compoundVariants: [
    // brand
    {
      class: {
        base: `
          border-brand-400
          dark:border-brand-600
        `,
        dot: 'bg-brand-500',
        icon: `
          text-brand-700
          dark:text-brand-300
        `,
        label: `
          text-brand-700
          dark:text-brand-300
        `,
        separator: `
          bg-brand-400
          dark:bg-brand-600
        `,
      },
      color: 'brand',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-brand-500 bg-brand-500',
        dot: 'bg-white',
        icon: 'text-primary-on-brand',
        label: 'text-primary-on-brand',
        separator: 'bg-brand-500',
      },
      color: 'brand',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-brand-200 bg-brand-25
          dark:border-brand-800 dark:bg-brand-950
        `,
        dot: 'bg-brand-500',
        icon: `
          text-brand-700
          dark:text-brand-200
        `,
        label: `
          text-brand-700
          dark:text-brand-200
        `,
        separator: `
          bg-brand-200
          dark:bg-brand-800
        `,
      },
      color: 'brand',
      variant: 'translucent',
    },

    // error
    {
      class: {
        base: `
          border-error-400
          dark:border-error-600
        `,
        dot: 'bg-error-500',
        icon: `
          text-error-700
          dark:text-error-300
        `,
        label: `
          text-error-700
          dark:text-error-300
        `,
        separator: `
          bg-error-400
          dark:bg-error-600
        `,
      },
      color: 'error',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-error-500 bg-error-500',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-error-500',
      },
      color: 'error',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-error-200 bg-error-25
          dark:border-error-800 dark:bg-error-950
        `,
        dot: 'bg-error-500',
        icon: `
          text-error-700
          dark:text-error-200
        `,
        label: `
          text-error-700
          dark:text-error-200
        `,
        separator: `
          bg-error-200
          dark:bg-error-800
        `,
      },
      color: 'error',
      variant: 'translucent',
    },

    // gray
    {
      class: {
        base: `
          border-gray-400
          dark:border-gray-600
        `,
        dot: 'bg-gray-500',
        icon: `
          text-gray-700
          dark:text-gray-300
        `,
        label: `
          text-gray-700
          dark:text-gray-300
        `,
        separator: `
          bg-gray-400
          dark:bg-gray-600
        `,
      },
      color: 'gray',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-gray-500 bg-gray-500',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-gray-500',
      },
      color: 'gray',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-gray-200 bg-gray-25
          dark:border-gray-800 dark:bg-gray-950
        `,
        dot: 'bg-gray-500',
        icon: `
          text-gray-500
          dark:text-gray-400
        `,
        label: `
          text-gray-700
          dark:text-gray-300
        `,
        separator: `
          bg-gray-200
          dark:bg-gray-800
        `,
      },
      color: 'gray',
      variant: 'translucent',
    },

    // success
    {
      class: {
        base: `
          border-success-400
          dark:border-success-600
        `,
        dot: 'bg-success-500',
        icon: `
          text-success-700
          dark:text-success-300
        `,
        label: `
          text-success-700
          dark:text-success-300
        `,
        separator: `
          bg-success-400
          dark:bg-success-600
        `,
      },
      color: 'success',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-success-500 bg-success-500',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-success-500',
      },
      color: 'success',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-success-200 bg-success-25
          dark:border-success-800 dark:bg-success-950
        `,
        dot: 'bg-success-500',
        icon: `
          text-success-700
          dark:text-success-200
        `,
        label: `
          text-success-700
          dark:text-success-200
        `,
        separator: `
          bg-success-200
          dark:bg-success-800
        `,
      },
      color: 'success',
      variant: 'translucent',
    },

    // blue
    {
      class: {
        base: `
          border-blue-400
          dark:border-blue-600
        `,
        dot: 'bg-blue-500',
        icon: `
          text-blue-700
          dark:text-blue-300
        `,
        label: `
          text-blue-700
          dark:text-blue-300
        `,
        separator: `
          bg-blue-400
          dark:bg-blue-600
        `,
      },
      color: 'blue',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-blue-600 bg-blue-600',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-blue-600',
      },
      color: 'blue',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-blue-200 bg-blue-25
          dark:border-blue-800 dark:bg-blue-950
        `,
        dot: 'bg-blue-500',
        icon: `
          text-blue-700
          dark:text-blue-200
        `,
        label: `
          text-blue-700
          dark:text-blue-200
        `,
        separator: `
          bg-blue-200
          dark:bg-blue-800
        `,
      },
      color: 'blue',
      variant: 'translucent',
    },

    // pink
    {
      class: {
        base: `
          border-pink-400
          dark:border-pink-600
        `,
        dot: 'bg-pink-500',
        icon: `
          text-pink-700
          dark:text-pink-300
        `,
        label: `
          text-pink-700
          dark:text-pink-300
        `,
        separator: `
          bg-pink-400
          dark:bg-pink-600
        `,
      },
      color: 'pink',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-pink-500 bg-pink-500',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-pink-500',
      },
      color: 'pink',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-pink-200 bg-pink-25
          dark:border-pink-800 dark:bg-pink-950
        `,
        dot: 'bg-pink-500',
        icon: `
          text-pink-700
          dark:text-pink-200
        `,
        label: `
          text-pink-700
          dark:text-pink-200
        `,
        separator: `
          bg-pink-200
          dark:bg-pink-800
        `,
      },
      color: 'pink',
      variant: 'translucent',
    },

    // purple
    {
      class: {
        base: `
          border-purple-400
          dark:border-purple-600
        `,
        dot: 'bg-purple-500',
        icon: `
          text-purple-700
          dark:text-purple-300
        `,
        label: `
          text-purple-700
          dark:text-purple-300
        `,
        separator: `
          bg-purple-400
          dark:bg-purple-600
        `,
      },
      color: 'purple',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-purple-500 bg-purple-500',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-purple-500',
      },
      color: 'purple',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-purple-200 bg-purple-25
          dark:border-purple-800 dark:bg-purple-950
        `,
        dot: 'bg-purple-500',
        icon: `
          text-purple-700
          dark:text-purple-200
        `,
        label: `
          text-purple-700
          dark:text-purple-200
        `,
        separator: `
          bg-purple-200
          dark:bg-purple-800
        `,
      },
      color: 'purple',
      variant: 'translucent',
    },

    // warning
    {
      class: {
        base: `
          border-warning-400
          dark:border-warning-600
        `,
        dot: 'bg-warning-500',
        icon: `
          text-warning-700
          dark:text-warning-300
        `,
        label: `
          text-warning-700
          dark:text-warning-300
        `,
        separator: `
          bg-warning-400
          dark:bg-warning-600
        `,
      },
      color: 'warning',
      variant: 'outline',
    },
    {
      class: {
        base: 'border-warning-500 bg-warning-500',
        dot: 'bg-white',
        icon: 'text-white',
        label: 'text-white',
        separator: 'bg-warning-500',
      },
      color: 'warning',
      variant: 'solid',
    },
    {
      class: {
        base: `
          border-warning-200 bg-warning-25
          dark:border-warning-800 dark:bg-warning-950
        `,
        dot: 'bg-warning-500',
        icon: `
          text-warning-700
          dark:text-warning-200
        `,
        label: `
          text-warning-700
          dark:text-warning-200
        `,
        separator: `
          bg-warning-200
          dark:bg-warning-800
        `,
      },
      color: 'warning',
      variant: 'translucent',
    },
  ],
  slots: {
    base: 'inline-flex items-center gap-sm border',
    dot: 'rounded-full',
    icon: '',
    label: 'font-medium',
    separator: 'mx-xs',
  },
  variants: {
    size: {
      lg: {
        base: 'h-7 px-sm',
        dot: 'size-1.5',
        icon: 'size-4',
        label: 'text-xs',
      },
      md: {
        base: 'h-6 px-sm',
        dot: 'size-1.5',
        icon: 'size-3',
        label: 'text-xxs',
      },
      sm: {
        base: 'h-5 px-xs',
        dot: 'size-1',
        icon: 'size-3',
        label: 'text-xxs',
      },
    },

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

    variant: {
      outline: {
        base: 'bg-transparent',
      },
      solid: {},
      translucent: {},
    },

    rounded: {
      default: {
        base: 'rounded-sm',
      },
      full: {
        base: 'rounded-full',
      },
    },
  },
})

export type BadgeVariants = ReturnType<typeof badgeVariants>
