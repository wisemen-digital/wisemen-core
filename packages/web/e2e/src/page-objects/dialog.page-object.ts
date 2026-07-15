import type {
  Locator,
  Page,
} from '@playwright/test'
import { expect } from '@playwright/test'

export class DialogTestUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  expectNoActiveDialog(): Promise<void> {
    return expect(this.page.getByRole('dialog')).toHaveCount(0)
  }

  getActiveDialog(): Locator {
    return this.page.getByRole('dialog')
  }
}
