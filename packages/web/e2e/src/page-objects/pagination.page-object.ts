import type { Page } from '@playwright/test'

const NEXT_PAGE_BUTTON_REGEX = /next/i
const PREVIOUS_PAGE_BUTTON_REGEX = /prev/i

/**
 * Utility for pagination in E2E tests.
 *
 * This class intentionally serves a dual purpose:
 * - The static methods shape raw arrays into the keyset/offset pagination
 *   envelopes the API returns, so they can be used to build mock responses.
 * - The instance methods (constructed with a `Page`) drive the paginator UI
 *   in the browser.
 */
export class PaginationTestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  static toKeysetPaginationResponse<T>(response: T[]): {
    items: T[]
    meta: {
      limit: number
      next: string | null
    }
  } {
    return {
      items: response,
      meta: {
        limit: response.length,
        next: null,
      },
    }
  }

  static toOffsetPaginationResponse<T>(response: T[]): {
    items: T[]
    meta: {
      limit: number
      offset: number
      total: number
    }
  } {
    return {
      items: response,
      meta: {
        limit: response.length,
        offset: 0,
        total: response.length,
      },
    }
  }

  /**
   * Reads the current (active) page number from the paginator. Best-effort:
   * parses the text of the element marked with `aria-current="page"` inside
   * the navigation landmark. Returns `0` when it cannot be determined.
   */
  async getCurrentPage(): Promise<number> {
    const currentItem = this.page.getByRole('navigation').locator('[aria-current="page"]')
    const text = await currentItem.textContent()
    const parsed = Number.parseInt(text ?? '', 10)

    return Number.isNaN(parsed) ? 0 : parsed
  }

  /**
   * Navigates to the next page.
   */
  async goToNextPage(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('button', {
      name: NEXT_PAGE_BUTTON_REGEX,
    }).click()
  }

  /**
   * Navigates to the page with the given number.
   */
  async goToPage(page: number): Promise<void> {
    await this.page.getByRole('navigation').getByRole('button', {
      name: String(page),
      exact: true,
    }).click()
  }

  /**
   * Navigates to the previous page.
   */
  async goToPreviousPage(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('button', {
      name: PREVIOUS_PAGE_BUTTON_REGEX,
    }).click()
  }
}
