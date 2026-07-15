import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class TableTestUtil {
  private tableLocator: Locator

  constructor(tableLocator: Locator) {
    this.tableLocator = tableLocator
  }

  /**
   * Clicks the row at the given index (0-based, skipping the header row).
   */
  async clickRow(rowIndex: number): Promise<void> {
    await this.getRow(rowIndex).click()
  }

  async clickRowAction(rowIndex: number, actionName: string): Promise<void> {
    const row = this.getRowByIndex(rowIndex)

    await row.getByRole('button', {
      name: 'Options',
    }).click()

    await this.tableLocator.page().getByRole('menuitem', {
      name: actionName,
    }).click()
  }

  /**
   * Asserts that each data row's cell at the given column index contains the
   * corresponding expected value.
   */
  async expectColumnValues(columnIndex: number, values: (string | RegExp)[]): Promise<void> {
    for (const [
      rowIndex,
      value,
    ] of values.entries()) {
      await expect(this.getCell(rowIndex, columnIndex)).toContainText(value)
    }
  }

  /**
   * Asserts that the table contains the specified headers.
   * @param headers Array of expected header texts.
   *
   * @example
   * await tableTestUtil.expectHeaders([
   *   'Name',
   *   'Email',
   *   'Phone',
   * ])
   */
  async expectHeaders(headers: string[]): Promise<void> {
    const headerRow = this.tableLocator.getByRole('row').nth(0)
    const headerCells = headerRow.getByRole('columnheader')

    for (const [
      i,
      header,
    ] of headers.entries()) {
      await expect(headerCells.nth(i)).toContainText(header)
    }
  }

  async expectRowActionToBeHidden(rowIndex: number, actionName: string): Promise<void> {
    const row = this.getRowByIndex(rowIndex)

    const actionsButton = row.getByRole('button', {
      name: 'Options',
    })

    await (expect(actionsButton).toBeHidden() || expect(this.tableLocator.page().getByRole('menuitem', {
      name: actionName,
    })).toBeHidden())
  }

  /**
   * Asserts that the number of data rows (excluding the header) equals `count`.
   */
  async expectRowCount(count: number): Promise<void> {
    const rowCount = await this.getRowCount()

    expect(rowCount).toBe(count)
  }

  /**
   * Asserts that the specified row contains the expected values.
   * @param rowIndex 0-based index
   * @param values Array of expected values for each cell in the row. Use `null` or `undefined` to expect a dash ('-').
   *
   * @example
   * await tableTestUtil.expectRowValues(0, [
   *   'John Doe',
   *   'Test Street 1',
   *   null,
   * ])
   */
  async expectRowValues(rowIndex: number, values: (string | RegExp | null | undefined)[]): Promise<void> {
    // +1 to skip header row
    const row = this.tableLocator.getByRole('row').nth(rowIndex + 1)
    const cells = row.getByRole('cell')

    for (const [
      i,
      value_,
    ] of values.entries()) {
      const value = value_ ?? '-'

      await expect(cells.nth(i)).toContainText(value)
    }
  }

  /**
   * Returns the cell at the given column index in the given data row (0-based,
   * skipping the header row).
   */
  getCell(rowIndex: number, columnIndex: number): Locator {
    return this.getRow(rowIndex).getByRole('cell').nth(columnIndex)
  }

  /**
   * Returns the data row at the given index. Alias of `getRowByIndex`.
   */
  getRow(rowIndex: number): Locator {
    return this.getRowByIndex(rowIndex)
  }

  /**
   * Opens the row's options menu and returns the menu item for the given action.
   */
  getRowActionButton(rowIndex: number, actionName: string): Locator {
    void this.getRow(rowIndex).getByRole('button', {
      name: 'Options',
    }).click()

    return this.tableLocator.page().getByRole('menuitem', {
      name: actionName,
    })
  }

  getRowByIndex(rowIndex: number): Locator {
    // +1 to skip header row
    return this.tableLocator.getByRole('row').nth(rowIndex + 1)
  }

  /**
   * Returns the number of data rows (excluding the header row).
   */
  async getRowCount(): Promise<number> {
    const rowCount = await this.tableLocator.getByRole('row').count()

    return Math.max(rowCount - 1, 0)
  }

  /**
   * Checks the select-all checkbox in the header row.
   */
  async selectAllRows(): Promise<void> {
    const headerRow = this.tableLocator.getByRole('row').first()

    await headerRow.getByRole('checkbox').check()
  }

  /**
   * Checks the checkbox of the data row at the given index.
   */
  async selectRow(rowIndex: number): Promise<void> {
    await this.getRow(rowIndex).getByRole('checkbox').check()
  }

  /**
   * Sorts the table by clicking the column header whose text contains `header`.
   */
  async sortByColumn(header: string): Promise<void> {
    await this.tableLocator.getByRole('columnheader', {
      name: header,
    }).click()
  }
}
