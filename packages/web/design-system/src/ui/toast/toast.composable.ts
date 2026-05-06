import { defineComponent, h, markRaw } from 'vue'
import { toast as toastState } from 'vue-sonner'

import type {
  PromiseToast,
  Toast,
} from '@/ui/toast/toast.type'
import ToastComponent from '@/ui/toast/Toast.vue'
import { animateToast } from '@/ui/toast/toastAnimation.util'

const PERMANENT_TOAST_DURATION = Infinity
const DEFAULT_TOAST_DURATION = 5000
const ERROR_TOAST_DURATION = 7000

export function useToast() {
  function show(toast: Toast): void {
    const existingToast = toast.id !== undefined
      ? toastState.getToasts().find((t) => t.id === toast.id) ?? null
      : null

    if (existingToast !== null) {
      animateToast(toast.id as string)
    }

    toastState.custom(markRaw(defineComponent({
      render: () => h(ToastComponent, { toast }),
    })), {
      id: toast.id ?? crypto.randomUUID(),
      class: 'w-full sm:w-96',
      dismissible: toast.dismissible,
      duration: toast.duration ?? (toast.variant === 'error' ? ERROR_TOAST_DURATION : DEFAULT_TOAST_DURATION),
      position: toast.position ?? 'bottom-right',
      onAutoClose: toast.onAutoClose,
      onDismiss: toast.onDismiss,
    })
  }

  function dismiss(toastId: string): void {
    toastState.dismiss(toastId)
  }

  function promise(toast: PromiseToast): void {
    const id = toast.id ?? crypto.randomUUID()

    show({
      id,
      dismissible: false,
      duration: PERMANENT_TOAST_DURATION,
      icon: toast.icon,
      interactableModels: toast.interactableModels,
      message: toast.loading,
      variant: 'loading',
      onAutoClose: toast.onAutoClose,
      onDismiss: toast.onDismiss,
    })

    function update(message: string, variant: 'error' | 'info'): void {
      const toastId = toastState.custom(markRaw(defineComponent({
        render: () => h(ToastComponent, {
          toast: {
            id,
            icon: toast.icon,
            interactableModels: toast.interactableModels,
            message,
            variant,
          },
        }),
      })), {
        id,
        class: 'w-full sm:w-96',
        dismissible: true,
        position: 'bottom-right',
        onAutoClose: toast.onAutoClose,
        onDismiss: toast.onDismiss,
      })

      setTimeout(() => {
        toastState.dismiss(toastId)
      }, toast.duration ?? (variant === 'error' ? ERROR_TOAST_DURATION : DEFAULT_TOAST_DURATION))
    }

    toast.promise.then(() => update(toast.success, 'info')).catch(() => update(toast.error, 'error'))
  }

  return {
    dismiss,
    promise,
    show,
  }
}
