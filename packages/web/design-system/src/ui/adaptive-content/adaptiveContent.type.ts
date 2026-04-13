export interface AdaptiveContentBlock {
  id: string
  element: HTMLElement
  /**
   * Priority of the content block. Lower numbers indicate higher priority.
   */
  priority: number
}
