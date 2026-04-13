export interface InputControlProps {
  /**
   * The unique identifier for the input control element.
   */
  id: string | null
  /**
   * Whether the input control is disabled.
   */
  isDisabled: boolean
  /**
   * Whether the input control is in an invalid state.
   */
  isInvalid: boolean
  /**
   * Whether the input control is in a loading state.
   */
  isLoading: boolean
  /**
   * Whether the input control is required.
   */
  isRequired: boolean
  /**
   * The HTML element to render as the container.
   * When not provided, renders as a child of the parent element.
   * @default null
   */
  as?: string | null
  /**
   * The ID of the element that describes this input control.
   */
  describedBy: string
}
