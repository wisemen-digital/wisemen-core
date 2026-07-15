import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Utility for interacting with the bulk-actions bar in E2E tests.
 */
export class BulkActionsUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Clicks the bulk action with the given name.
   */
  async clickBulkAction(actionName: string): Promise<void> {
    await this.page.getByRole('button', {
      name: actionName,
    }).or(this.page.getByRole('menuitem', {
      name: actionName,
    })).click()
  }

  /**
   * Asserts that the given number of items are selected.
   */
  async expectSelectedCount(count: number): Promise<void> {
    await expect(this.page.getByText(`${count} selected`)).toBeVisible()
  }
}
