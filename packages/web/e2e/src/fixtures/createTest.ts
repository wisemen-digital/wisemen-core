import { test as base } from '@playwright/test'
import { http } from 'msw'
import type { MockServiceWorker } from 'playwright-msw'
import { createWorkerFixture } from 'playwright-msw'

import { runAccessibilityCheck } from '@/utils/a11y.util'
import { setupConsoleMonitoring } from '@/utils/console.util'
import { setupContextWithCoverage } from '@/utils/coverage.util'
import { permissionContext } from '@/utils/permissionContext.util'
import { setupWebSocketMock } from '@/utils/websocket.util'

export interface CreateTestOptions<T extends string = string> {
  /** Default permissions for all tests (can be overridden per-test with test.use) */
  defaultPermissions?: T[]
  /** Warnings to exclude from console monitoring (in addition to the built-in defaults). Default: [] */
  excludedConsoleWarnings?: string[]
  /** Whether console errors should fail the test. Default: true */
  failOnConsoleError?: boolean
  /** MSW request handlers (auth, API mocks, etc.) */
  handlers: Parameters<typeof createWorkerFixture>[0]
  /** WebSocket URL pattern to mock (default: 'wss://&#42;/websockets&#42;') */
  websocketUrlPattern?: string
}

export interface BaseTestFixtures<T extends string = string> {
  http: typeof http
  userPermissions: T[]
  worker: MockServiceWorker
}

export function createTest<T extends string = string>(options: CreateTestOptions<T>) {
  const {
    defaultPermissions = [],
    excludedConsoleWarnings = [],
    failOnConsoleError = true,
    handlers,
    websocketUrlPattern,
  } = options

  return base.extend<BaseTestFixtures<T>>({
    context: async ({
      context,
    }, use) => {
      const coverage = await setupContextWithCoverage(context)

      await use(context)
      await coverage.cleanup()
    },
    http,
    page: async ({
      page, userPermissions,
    }, use, testInfo) => {
      const consoleMonitoring = setupConsoleMonitoring(page, {
        excludedWarnings: excludedConsoleWarnings,
        failOnError: failOnConsoleError,
      })

      permissionContext.setPermissions(userPermissions)

      await page.addInitScript((permissions) => {
        (window as any).__TEST_PERMISSIONS__ = permissions
      }, userPermissions)

      await setupWebSocketMock(page, websocketUrlPattern)
      await use(page)
      await runAccessibilityCheck(page, testInfo)

      permissionContext.clearPermissions()
      consoleMonitoring.validate()
    },
    userPermissions: [
      async ({}, use): Promise<void> => {
        await use(defaultPermissions)
      },
      {
        option: true,
      },
    ],
    worker: createWorkerFixture(handlers),
  })
}
