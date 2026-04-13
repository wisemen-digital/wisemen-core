import { h } from 'vue'
import type { ToastT } from 'vue-sonner'
import { toast as toastState } from 'vue-sonner'

import { useInjectConfigContext } from '@/components/config-provider/config.context'
import type { ToastProps } from '@/components/toast/toast.props'
import Toast from '@/components/toast/Toast.vue'

const PERMANENT_TOAST_DURATION = Infinity
const AUTO_CLOSE_TOAST_DURATION = 5000
const AUTO_CLOSE_ERROR_TOAST_DURATION = 7000

export interface AutoCloseToastConfig {
  /**
   * If `true`, error toasts will automatically close after a default duration.
   * If a number is provided, error toasts will automatically close after the specified duration in milliseconds.
   */
  error?: boolean | number
  /**
   * If `true`, info toasts will automatically close after a default duration.
   * If a number is provided, info toasts will automatically close after the specified duration in milliseconds.
   */
  info?: boolean | number
  /**
   * If `true`, success toasts will automatically close after a default duration.
   * If a number is provided, success toasts will automatically close after the specified duration in milliseconds.
   */
  success?: boolean | number
}

export type ToastPosition = NonNullable<ToastT['position']>

interface ToastOptions extends Omit<ToastProps, 'type'> {
  /**
   * The time in milliseconds after which the toast will automatically close.
   * If no timeout is provided, the toast will not automatically close unless `autoCloseToast` is set to `true`
   * in the config provider component.
   */
  durationMs?: number | null
}

interface UseToastReturnType {
  error: (toast: ToastOptions) => void
  info: (toast: ToastOptions) => void
  success: (toast: ToastOptions) => void
}

function getToastId(toast: ToastOptions): string {
  return `${toast.title}${toast.description}`
}

export function useToast(): UseToastReturnType {
  const {
    autoCloseToast, toastPosition,
  } = useInjectConfigContext()

  function getToastDuration(toast: ToastOptions, type: keyof AutoCloseToastConfig): number {
    // If a proper toast duration is provided, it takes precedence over global config
    if (toast.durationMs !== undefined && toast.durationMs !== null) {
      return toast.durationMs
    }

    const globalConfig = autoCloseToast.value?.[type] ?? null

    // If no global config is provided, fall back to default durations
    if (globalConfig === null) {
      return type === 'error' ? PERMANENT_TOAST_DURATION : AUTO_CLOSE_TOAST_DURATION
    }

    const DEFAULT_AUTO_CLOSE_DURATION = type === 'error'
      ? AUTO_CLOSE_ERROR_TOAST_DURATION
      : AUTO_CLOSE_TOAST_DURATION

    if (typeof globalConfig === 'number') {
      return globalConfig
    }

    if (globalConfig === true) {
      return DEFAULT_AUTO_CLOSE_DURATION
    }

    return PERMANENT_TOAST_DURATION
  }

  function showErrorToast(toast: ToastOptions): void {
    toastState.custom(h(Toast, {
      ...toast,
      type: 'error',
    }), {
      id: getToastId(toast),
      duration: getToastDuration(toast, 'error'),
      position: toastPosition,
    })
  }

  function showInfoToast(toast: ToastOptions): void {
    toastState.custom(h(Toast, {
      ...toast,
      type: 'info',
    }), {
      id: getToastId(toast),
      duration: getToastDuration(toast, 'info'),
      position: toastPosition,
    })
  }

  function showSuccessToast(toast: ToastOptions): void {
    toastState.custom(h(Toast, {
      ...toast,
      type: 'success',
    }), {
      id: getToastId(toast),
      duration: getToastDuration(toast, 'success'),
      position: toastPosition,
    })
  }

  return {
    error: showErrorToast,
    info: showInfoToast,
    success: showSuccessToast,
  }
}
