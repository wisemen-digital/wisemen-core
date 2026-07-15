import type {
  Locator,
  Page,
} from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * General-purpose test utility for interacting with dialogs on the page.
 */
export class TestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Asserts that the active dialog contains the given text.
   */
  async expectDialogWithText(text: string): Promise<void> {
    await expect(this.getActiveDialog()).toContainText(text)
  }

  /**
   * Asserts that the active dialog has a heading with the given title.
   */
  async expectDialogWithTitle(title: string): Promise<void> {
    await expect(this.getActiveDialog().getByRole('heading', {
      name: title,
    })).toBeVisible()
  }

  /**
   * Asserts that there is no active dialog on the page.
   */
  expectNoActiveDialog(): Promise<void> {
    return expect(this.page.getByRole('dialog')).toHaveCount(0)
  }

  /**
   * Returns the currently active dialog.
   */
  getActiveDialog(): Locator {
    return this.page.getByRole('dialog')
  }

  /**
   * Waits for a dialog to become visible and returns it.
   */
  async waitForDialog(): Promise<Locator> {
    const dialog = this.page.getByRole('dialog')

    await dialog.waitFor({
      state: 'visible',
    })

    return dialog
  }
}
