import type {
  Locator,
  Page,
} from '@playwright/test'

const EMPTY_STATE_MESSAGE_REGEX = /no results|empty|nothing (found|here)/i

/**
 * Utility for asserting loading, error and empty states in E2E tests.
 */
export class StateTestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Returns the empty-state message, if present.
   */
  getEmptyStateMessage(): Locator {
    return this.page.getByText(EMPTY_STATE_MESSAGE_REGEX)
  }

  /**
   * Returns the error message alert, if present.
   */
  getErrorMessage(): Locator {
    return this.page.getByRole('alert')
  }

  /**
   * Returns the loading indicator, matched via `aria-busy` or the `status` role.
   */
  getLoadingIndicator(): Locator {
    return this.page.locator('[aria-busy="true"], [role="status"]')
  }

  /**
   * Waits for the loading indicator to disappear.
   */
  async waitForLoadingToComplete(): Promise<void> {
    await this.getLoadingIndicator().waitFor({
      state: 'hidden',
    })
  }
}
