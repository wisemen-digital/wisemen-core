import { tv } from "@/styles/tailwindVariants.lib";

export const toastVariants = tv({
  slots: {
    title: 'mb-xs text-sm font-medium'
  },
  variants: {
    variant: {
      'info': {
        title: 'text-primary'
      },
      'warning': {
        title: 'text-warning-primary',
      },
      'error': {
        title: 'text-error-primary'
      }
    }
  }
})

export type ToastVariants = ReturnType<typeof toastVariants>
