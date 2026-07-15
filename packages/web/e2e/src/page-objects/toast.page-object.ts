import type {
  Locator,
  Page,
} from '@playwright/test'

type ToastType = 'error' | 'info' | 'success' | 'warning'

const DISMISS_BUTTON_REGEX = /dismiss|close/i

/**
 * Utility for interacting with toast notifications in E2E tests.
 */
export class ToastTestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Dismisses the toast of the given type by clicking its dismiss/close button.
   */
  async dismissToast(type: ToastType): Promise<void> {
    await this.getToastByType(type).getByRole('button', {
      name: DISMISS_BUTTON_REGEX,
    }).click()
  }

  /**
   * Returns the most recently rendered toast.
   */
  getLastToast(): Locator {
    return this.page.getByRole('alert').last()
  }

  /**
   * Locates a toast of the given type.
   *
   * Expects each toast to expose its type through a `data-toast-type`
   * attribute (e.g. `data-toast-type="success"`) on the toast root element,
   * which carries either the `alert` or `status` role.
   */
  getToastByType(type: ToastType): Locator {
    return this.page.locator(`[role="alert"][data-toast-type="${type}"], [role="status"][data-toast-type="${type}"]`)
  }

  /**
   * Waits for the toast of the given type to become visible.
   */
  async waitForToast(type: ToastType): Promise<void> {
    await this.getToastByType(type).waitFor({
      state: 'visible',
    })
  }
}
