import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

interface ConsoleMonitor {
  validate: () => void
}

export interface ConsoleMonitoringOptions {
  /** Warnings to exclude in addition to the built-in {@link DEFAULT_EXCLUDED_WARNINGS}. Default: `[]`. */
  excludedWarnings?: string[]
  /** Whether collected console errors should fail the test. Default: `true`. */
  failOnError?: boolean
  /** Whether collected console warnings should fail the test. Default: `false`. */
  failOnWarning?: boolean
}

const DEFAULT_EXCLUDED_WARNINGS = [
  // Motion warning, only seems to happen during tests
  'You are trying to animate filter from',
  'You are trying to animate transform from',
]

/**
 * Sets up console monitoring for a page, collecting `error` and `warning`
 * console events emitted while the test runs.
 *
 * Unlike the original implementation — whose `validate()` was a no-op (both
 * assertions were commented out) — this version actually asserts on teardown:
 * console errors fail the test by default (`failOnError`), while warnings do
 * not (opt in via `failOnWarning`). Warnings are filtered against
 * {@link DEFAULT_EXCLUDED_WARNINGS} plus any caller-supplied `excludedWarnings`.
 *
 * @example
 * ```ts
 * const monitor = setupConsoleMonitoring(page)
 * // ...run test...
 * monitor.validate() // throws if any console error was logged
 * ```
 */
export function setupConsoleMonitoring(
  page: Page,
  options: ConsoleMonitoringOptions = {},
): ConsoleMonitor {
  const {
    excludedWarnings = [],
    failOnError = true,
    failOnWarning = false,
  } = options

  const errors: string[] = []
  const warnings: string[] = []

  const allExcluded = [
    ...DEFAULT_EXCLUDED_WARNINGS,
    ...excludedWarnings,
  ]

  page.on('console', (event): void => {
    if (event.type() === 'error') {
      errors.push(event.text())
    }
    if (event.type() === 'warning' && !allExcluded.some((excluded) => event.text().includes(excluded))) {
      warnings.push(event.text())
    }
  })

  return {
    validate(): void {
      if (failOnError) {
        expect(errors, 'Console errors were logged during the test').toEqual([])
      }
      if (failOnWarning) {
        expect(warnings, 'Console warnings were logged during the test').toEqual([])
      }
    },
  }
}
