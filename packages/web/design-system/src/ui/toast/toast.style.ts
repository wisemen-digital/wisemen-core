import { tv } from '@/styles/tailwindVariants.lib'

export const toastVariants = tv({
  slots: {
    title: 'mb-xs text-sm font-medium',
  },
  variants: {
    variant: {
      error: {
        title: 'text-error-primary',
      },
      info: {
        title: 'text-primary',
      },
      warning: {
        title: 'text-warning-primary',
      },
    },
  },
})

export type ToastVariants = ReturnType<typeof toastVariants>
