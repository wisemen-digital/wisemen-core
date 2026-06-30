import type { Form } from 'formango'

import type { DialogProps } from '@/ui/dialog/dialog.props'

export interface FormDialogProps extends DialogProps {
  /**
   * The formango form instance.
   */
  form: Form<any>
  /**
   * Whether to show the built-in close-blocking prompt when there are unsaved changes.
   * When `false`, dirty form dialogs will close immediately.
   * @default true
   */
  promptOnUnsavedChanges?: boolean
  /**
   * Whether the dialog should render its own form component. If `true`, the dialog will not render a `FormComponent`
   * and instead expects the consumer to render their own form component within the default slot.
   * @default false
   */
  renderOwnFormComponent?: boolean
  /**
   * Override text for the built-in unsaved-changes prompt. When `null`, the localized default copy is used.
   * @default null
   */
  unsavedChangesText?: string | null
}
