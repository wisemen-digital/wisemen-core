import {
  createSharedComposable,
  useEventListener,
} from '@vueuse/core'
import type { Ref } from 'vue'
import { ref } from 'vue'

export interface UseMenuAutoHighlightReturn {
  onCloseAutoFocus: (event: Event) => void
  onOpenAutoFocus: (event: Event) => void
}

const ITEM_SELECTOR = '[data-reka-collection-item]:not([data-disabled])'
const HIGHLIGHTED_ITEM_SELECTOR = '[data-highlighted]'
// Matches the delay Reka UI's own DropdownMenuFilter uses for its autofocus
const DISPATCH_DELAY_IN_MS = 1

function useIsUsingKeyboardImpl(): Ref<boolean> {
  const isUsingKeyboard = ref(false)

  useEventListener('keydown', () => {
    isUsingKeyboard.value = true
  }, {
    capture: true,
    passive: true,
  })

  useEventListener([
    'pointerdown',
    'pointermove',
  ], () => {
    isUsingKeyboard.value = false
  }, {
    capture: true,
    passive: true,
  })

  return isUsingKeyboard
}

/**
 * Mirrors Reka UI's own (internal, not publicly exported) keyboard-vs-pointer
 * tracking, so we can tell whether the user is currently driving the menu
 * via keyboard without reaching into its private context.
 */
const useIsUsingKeyboard = createSharedComposable(useIsUsingKeyboardImpl)

/**
 * Reka UI's own FocusScope fallback (focusing the content when nothing else
 * claims focus) gets skipped once we call `event.preventDefault()`, so we
 * replicate it ourselves to avoid regressing focus behaviour for menus that
 * end up with nothing highlighted (eg. opened by pointer and never searched).
 */
function focusDeferred(element: HTMLElement): void {
  setTimeout(() => {
    element.focus({
      preventScroll: true,
    })
  }, DISPATCH_DELAY_IN_MS)
}

/**
 * Dispatches a synthetic ArrowDown so Reka UI's own arrow-navigation logic
 * highlights the first item, exactly as if the user had pressed it.
 *
 * We deliberately don't call `.focus()` on the item ourselves: a filter
 * input (eg. in ActionDropdownMenuContent) auto-focuses itself, and Reka's
 * own keydown handler for that input already knows how to highlight an item
 * without stealing focus away from it (that's how arrow-key navigation while
 * typing already works). Dispatching on whatever currently has focus reuses
 * that exact handling instead of us re-implementing and racing against it.
 */
function dispatchArrowDown(container: HTMLElement): void {
  const activeElement = document.activeElement
  const target = activeElement instanceof HTMLElement && container.contains(activeElement)
    ? activeElement
    : container

  target.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'ArrowDown',
  }))

  container.querySelector(HIGHLIGHTED_ITEM_SELECTOR)?.scrollIntoView({
    block: 'nearest',
  })
}

/**
 * Items can appear or disappear for the entire time a menu is open: they may
 * load in asynchronously (eg. behind a loading skeleton), or be filtered in
 * and out (eg. filtering down to zero results and then clearing the
 * filter, or typing a search query into a menu that was opened by pointer).
 * This keeps re-checking for as long as the menu is open, instead of
 * stopping after the first successful highlight, so a later change that
 * leaves nothing highlighted gets corrected too - but only while the user is
 * actually driving the menu via keyboard.
 */
function watchForFirstItem(container: HTMLElement, isUsingKeyboard: Ref<boolean>): void {
  let isDispatchScheduled = false

  function highlightFirstItemIfNoneSelected(): void {
    if (!isUsingKeyboard.value) {
      return
    }

    if (isDispatchScheduled || container.querySelector(HIGHLIGHTED_ITEM_SELECTOR) !== null) {
      return
    }

    if (container.querySelector(ITEM_SELECTOR) === null) {
      return
    }

    isDispatchScheduled = true

    setTimeout(() => {
      isDispatchScheduled = false

      if (isUsingKeyboard.value && container.querySelector(HIGHLIGHTED_ITEM_SELECTOR) === null) {
        dispatchArrowDown(container)
      }
    }, DISPATCH_DELAY_IN_MS)
  }

  highlightFirstItemIfNoneSelected()

  const observer = new MutationObserver(highlightFirstItemIfNoneSelected)

  observer.observe(container, {
    childList: true,
    subtree: true,
  })
}

/**
 * Reka UI only highlights the first menu item on open when the menu was
 * triggered via keyboard, and even then only if the item already exists in
 * the DOM at that exact moment. This makes sure a menu always ends up with
 * an item highlighted whenever the user is driving it via keyboard - whether
 * that's right on open, once items that were still loading become
 * available, or because the user started typing a search query into a menu
 * that was originally opened by pointer. A menu that's opened and never
 * interacted with via keyboard is left untouched.
 */
export function useMenuAutoHighlight(): UseMenuAutoHighlightReturn {
  const isUsingKeyboard = useIsUsingKeyboard()
  // Snapshotted at open time rather than read live at close time: closing via Escape is
  // itself a keydown, which would otherwise flip `isUsingKeyboard` to true just before
  // `onCloseAutoFocus` fires and make every close look keyboard-driven.
  let wasOpenedViaKeyboard = false

  function onOpenAutoFocus(event: Event): void {
    const container = event.target

    if (!(container instanceof HTMLElement)) {
      return
    }

    wasOpenedViaKeyboard = isUsingKeyboard.value

    event.preventDefault()
    focusDeferred(container)
    watchForFirstItem(container, isUsingKeyboard)
  }

  // Reka UI returns focus to the trigger element on close by default, which is correct
  // behaviour for a keyboard-opened menu but not for one opened by right-click: the trigger
  // (eg. a DataTable row's own invisible tab-stop button) was never focused by the user to
  // begin with, so snapping focus onto it just paints a phantom focus ring. Only let Reka's
  // default happen when the menu was actually opened via keyboard.
  function onCloseAutoFocus(event: Event): void {
    if (!wasOpenedViaKeyboard) {
      event.preventDefault()
    }
  }

  return {
    onCloseAutoFocus,
    onOpenAutoFocus,
  }
}
