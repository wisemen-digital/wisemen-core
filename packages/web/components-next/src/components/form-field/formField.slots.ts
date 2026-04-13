export interface FormFieldLabelSlots {
  /**
   * Slot for content to be displayed before the label.
   */
  leading: () => unknown
  /**
   * Slot for content positioned to the right of the label.
   */
  right: () => unknown
  /**
   * Slot for content to be displayed after the label.
   */
  trailing: () => unknown
}

export interface FormFieldSlots {
  /**
   * Slot for the main content inside the form field.
   */
  default: () => unknown
  /**
   * Slot for custom error messages, overriding the default error display.
   */
  error: () => unknown
  /**
   * Slot for additional information or guidance related to the form field, overriding the default hint text.
   */
  hint: () => unknown
  /**
   * Slot for customizing the label of the form field, overriding the default label display.
   */
  label: () => unknown
}
