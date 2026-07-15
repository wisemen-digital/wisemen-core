import type {
  Locator,
  Page,
} from '@playwright/test'

const BREADCRUMB_NAME_REGEX = /breadcrumb/i

/**
 * Utility for interacting with the breadcrumb navigation in E2E tests.
 */
export class BreadcrumbTestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Returns the breadcrumb item marked as the current page.
   */
  getCurrentItem(): Locator {
    return this.page.getByRole('navigation', {
      name: BREADCRUMB_NAME_REGEX,
    }).locator('[aria-current="page"]')
  }

  /**
   * Returns the breadcrumb item with the given label.
   */
  getItem(label: string): Locator {
    return this.page.getByRole('navigation', {
      name: BREADCRUMB_NAME_REGEX,
    }).getByRole('link', {
      name: label,
    })
  }
}
