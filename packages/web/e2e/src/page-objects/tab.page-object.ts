import type {
  Locator,
  Page,
} from '@playwright/test'

/**
 * Utility for interacting with tabs in E2E tests.
 */
export class TabTestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Returns the currently active tab panel.
   */
  getActivePanel(): Locator {
    return this.page.getByRole('tabpanel')
  }

  /**
   * Returns the tab with the given name.
   */
  getTab(name: string): Locator {
    return this.page.getByRole('tab', {
      name,
    })
  }

  /**
   * Switches to the tab with the given name.
   */
  async switchTab(name: string): Promise<void> {
    await this.getTab(name).click()
  }
}
