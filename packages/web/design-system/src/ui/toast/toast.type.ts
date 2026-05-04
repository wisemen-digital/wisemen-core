import type { ButtonProps as UIButtonProps } from '@/ui/button/button/button.props'
import type { LinkProps as UILinkProps } from '@/ui/button/link/link.props'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type ToastType = 'error' | 'info' | 'loading' | 'warning'
export type ToastPosition = 'bottom-right' | 'top-right'

export interface ToastInteractableModel {
  icon?: Component
  imageSrc?: string
  label: string
  to?: RouteLocationRaw
}

export type ToastButtonAction = Pick<UIButtonProps, 'iconLeft' | 'keyboardShortcut' | 'label'> & {
  onClick: () => void
}

export type ToastLinkAction = Pick<UILinkProps, 'iconLeft' | 'keyboardShortcut' | 'label' | 'to'>

export interface Toast {
  // Unique identifier for the toast. If provided, the toast can only be opened once at a time
  id?: string
  title?: string
  button?: ToastButtonAction
  dismissible?: boolean
  duration?: number
  icon?: Component
  interactableModels?: Record<string, ToastInteractableModel>
  link?: ToastLinkAction
  message: string
  position?: ToastPosition
  type?: ToastType
  onAutoClose?: () => void
  onDismiss?: () => void
}

export interface PromiseToast extends Omit<Toast, 'message' | 'type'> {
  error: string
  loading: string
  promise: Promise<unknown>
  success: string
}
