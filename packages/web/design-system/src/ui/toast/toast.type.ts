import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type { ButtonProps as UIButtonProps } from '@/ui/button/button/button.props'
import type { LinkProps as UILinkProps } from '@/ui/button/link/link.props'

export type ToastAutoClose = 'all-except-errors' | 'always' | 'never'

export type ToastVariant = 'error' | 'info' | 'loading' | 'warning'
export type ToastPosition = 'bottom-right' | 'top-right'

export interface ToastInteractableModel {
  /**
   * A Vue component rendered as a leading icon for this model's item.
   */
  icon?: Component

  /**
   * URL or path to an image rendered as a leading visual for this model's item.
   * Takes precedence over `icon` if both are provided
   */
  imageSrc?: string

  /**
   * The display label shown for this interactable item.
   */
  label: string

  /**
   * The route this item navigates to when clicked`.
   */
  to?: RouteLocationRaw
}

export type ToastButtonAction = Pick<UIButtonProps, 'iconLeft' | 'keyboardShortcut' | 'label'> & {
  onClick: () => void
}

export type ToastLinkAction = Pick<UILinkProps, 'iconLeft' | 'keyboardShortcut' | 'label' | 'to'>

export interface Toast {
  /**
   * Unique identifier for the toast.
   * When provided, ensures only one toast with this ID can be open at a time.
   * If a toast with the same ID is already open and the content has changed, it will be updated in place.
   */
  id?: string

  /**
   * The title displayed at the top of the toast.
   */
  title?: string

  /**
   * An optional call-to-action button rendered inside the toast.
   */
  button?: ToastButtonAction

  /**
   * Whether the user can manually dismiss the toast.
   * @default true
   */
  dismissible?: boolean

  /**
   * How long the toast stays visible before auto-closing, in milliseconds.
   * Set to `Infinity` to disable auto-close.
   */
  duration?: number

  /**
   *  A Vue component rendered as a leading icon inside the toast.
   */
  icon?: Component

  /**
   * A map of named interactable models (e.g. inputs, toggles) rendered inside the toast body.
   * Keyed by model name for easy access and binding.
   */
  interactableModels?: Record<string, ToastInteractableModel>

  /**
   * An optional link action rendered inside the toast, typically as an anchor or router-link.
   */
  link?: ToastLinkAction

  /**
   * The main text content of the toast.
   */
  message: string

  /**
   * Where on the screen the toast should appear.
   * @default 'bottom-right'
   */
  position?: ToastPosition

  /**
   * The visual style of the toast, used to convey intent.
   * @default 'info'
   */
  variant?: ToastVariant

  /**
   * Called when the toast closes automatically after its `duration` has elapsed.
   */
  onAutoClose?: () => void

  /**
   * Called when the user manually dismisses the toast.
   */
  onDismiss?: () => void
}

export interface PromiseToast extends Omit<Toast, 'message' | 'variant'> {
  error: string
  loading: string
  promise: Promise<unknown>
  success: string
}
