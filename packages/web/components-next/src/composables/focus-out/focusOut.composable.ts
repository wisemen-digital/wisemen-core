import type { ComputedRef } from 'vue'
import {
  onBeforeUnmount,
  onMounted,
} from 'vue'

/**
 * Composable for detecting when an element loses focus when @blur cannot be used (e.g. for
 * elements that are not focusable by default).
 *
 * This utility helps track focus changes and triggers a callback when the focus moves
 * outside the provided element.
 *
 * @param element - A reactive reference to the target HTML element.
 * @param onFocusOutCb - A callback function invoked when focus moves outside the element.
 *
 * @throws Error if the element is null when mounted.
 *
 * @example
 * ```ts
 * const wrapperRef = ref<HTMLElement | null>(null)
 *
 * useFocusOut(wrapperRef, (event) => {
 *   console.log('Focus lost', event)
 * })
 * ```
 */
export function useFocusOut(
  element: ComputedRef<HTMLElement | null>,
  onFocusOutCb: (event: FocusEvent) => void,
): void {
  function onFocusOut(event: FocusEvent): void {
    setTimeout(() => {
      const isFocusInside = element.value!.contains(document.activeElement)

      if (!isFocusInside) {
        onFocusOutCb(event)
      }
    })
  }

  onMounted(() => {
    if (element.value === null) {
      throw new Error('Element is null')
    }

    element.value.addEventListener('focusout', onFocusOut)
  })

  onBeforeUnmount(() => {
    element.value?.removeEventListener('focusout', onFocusOut)
  })
}
