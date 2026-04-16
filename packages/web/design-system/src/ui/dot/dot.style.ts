import { tv } from '@/styles/tailwindVariants.lib'

export const dotVariants = tv({
  base: 'shrink-0 rounded-full',
  variants: {
    color: {
      blue: 'bg-blue-500',
      brand: 'bg-brand-500',
      error: 'bg-error-500',
      gray: 'bg-gray-400',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      white: 'bg-white',
    },
    size: {
      lg: 'size-2',
      md: 'size-1.5',
      sm: 'size-1',
    },
  },
})
