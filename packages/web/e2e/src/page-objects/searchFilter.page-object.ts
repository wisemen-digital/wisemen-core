import type {
  Locator,
  Page,
} from '@playwright/test'

const SEARCH_BOX_NAME_REGEX = /search/i
const CLEAR_FILTERS_BUTTON_REGEX = /clear (all )?filters/i

/**
 * Utility for interacting with search and filter controls in E2E tests.
 */
export class SearchFilterUtil {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  private getSearchBox(): Locator {
    return this.page.getByRole('searchbox').or(this.page.getByRole('textbox', {
      name: SEARCH_BOX_NAME_REGEX,
    }))
  }

  /**
   * Opens the filter control with the given label and selects the given option.
   */
  async applyFilter(filterLabel: string, value: string): Promise<void> {
    await this.page.getByRole('button', {
      name: filterLabel,
    }).click()

    await this.page.getByRole('option', {
      name: value,
    }).click()
  }

  /**
   * Clears all active filters.
   */
  async clearFilters(): Promise<void> {
    await this.page.getByRole('button', {
      name: CLEAR_FILTERS_BUTTON_REGEX,
    }).click()
  }

  /**
   * Clears the search input.
   */
  async clearSearch(): Promise<void> {
    await this.getSearchBox().clear()
  }

  /**
   * Fills the search input with the given query.
   */
  async search(query: string): Promise<void> {
    await this.getSearchBox().fill(query)
  }
}
