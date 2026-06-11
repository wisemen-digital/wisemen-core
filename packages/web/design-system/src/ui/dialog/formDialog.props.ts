import type { Form } from 'formango'

import type { DialogProps } from '@/ui/dialog/dialog.props'

export interface FormDialogProps extends DialogProps {
  /**
   * Disables the built-in close-blocking chin. When `true`, dirty form dialogs will close immediately.
   * @default false
   */
  disableUnsavedChangesChin?: boolean
  /**
   * The formango form instance.
   */
  form: Form<any>
  /**
   * Whether to prompt the user when there are unsaved changes.
   * @default false
   */
  promptOnUnsavedChanges?: boolean
  /**
   * Whether the dialog should render its own form component. If `true`, the dialog will not render a `FormComponent`
   * and instead expects the consumer to render their own form component within the default slot.
   * @default false
   */
  renderOwnFormComponent?: boolean
  /**
   * Override text for the built-in invalid-close chin. When `null`, the localized default copy is used.
   * @default null
   */
  unsavedChangesChinText?: string | null
}
