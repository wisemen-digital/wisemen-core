import type { PlaywrightTestConfig } from '@playwright/test'
import {
  defineConfig as definePlaywrightConfig,
  devices,
} from '@playwright/test'

const DEFAULT_PORT = 4000
const DEFAULT_TEST_MATCH = 'src/modules/**/tests/*.e2e.spec.ts'

/**
 * Options for {@link defineConfig}, the typed wrapper around Playwright's own
 * `defineConfig`.
 */
export interface WebE2eConfigOptions {
  /**
   * Authentication project wiring. When both `enabled` is `true` and
   * `storageStatePath` is provided, a dedicated `'setup'` project runs first
   * (matching `setupMatch`, default `'**\/*.setup.ts'`) and the `'chromium'`
   * project depends on it while reusing the saved storage state. Otherwise a
   * single `'chromium'` project is emitted.
   */
  auth?: {
    enabled?: boolean
    setupMatch?: string
    storageStatePath?: string
  }
  /** Port the app runs on. Used to build `use.baseURL`. Default: `4000`. */
  port?: number
  /** Number of retries for failing tests. Default: `0`. */
  retries?: number
  /** Directory that contains the test files. Passed through to Playwright. */
  testDir?: string
  /**
   * Testing feature toggles. Attached to the returned config's `metadata`
   * under `webE2e` so consumers and fixtures can read them at runtime, e.g.
   * `metadata: { webE2e: { accessibility, consoleMonitoring, coverage } }`.
   */
  testing?: {
    accessibility?: boolean
    consoleMonitoring?: boolean
    coverage?: boolean
  }
  /** Glob(s) matching test files. Default targets `*.e2e.spec.ts` under `src/modules/{module}/tests`. */
  testMatch?: string | string[]
  /** Playwright `use` options, shallow-merged over the defaults (`baseURL`, `trace`). */
  use?: PlaywrightTestConfig['use']
  /** Playwright web server configuration. Passed through unchanged. */
  webServer?: PlaywrightTestConfig['webServer']
  /** Number of parallel workers. Passed through unchanged. */
  workers?: number
}

/**
 * Typed wrapper around Playwright's `defineConfig` with sensible defaults for
 * web e2e suites (parallel execution, list + html reporters, a localhost
 * `baseURL`, and an optional auth setup project).
 *
 * @example
 * ```ts
 * import { defineConfig } from '@wisemen/web-e2e/config'
 *
 * export default defineConfig({
 *   port: 4000,
 *   auth: {
 *     enabled: true,
 *     storageStatePath: 'tests/.auth/user.json',
 *   },
 *   webServer: {
 *     command: 'pnpm preview',
 *     url: 'http://localhost:4000',
 *     reuseExistingServer: !process.env.CI,
 *   },
 * })
 * ```
 */
export function defineConfig(options: WebE2eConfigOptions = {}): PlaywrightTestConfig {
  const {
    auth,
    port = DEFAULT_PORT,
    retries = 0,
    testDir,
    testing,
    testMatch = DEFAULT_TEST_MATCH,
    use,
    webServer,
    workers,
  } = options

  const baseURL = `http://localhost:${port}`

  const projects: NonNullable<PlaywrightTestConfig['projects']> = []

  if (auth?.enabled === true && auth.storageStatePath !== undefined) {
    projects.push({
      name: 'setup',
      testMatch: auth.setupMatch ?? '**/*.setup.ts',
    })
    projects.push({
      name: 'chromium',
      dependencies: [
        'setup',
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: auth.storageStatePath,
      },
    })
  }
  else {
    projects.push({
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    })
  }

  return definePlaywrightConfig({
    fullyParallel: true,
    metadata: {
      webE2e: {
        accessibility: testing?.accessibility ?? true,
        consoleMonitoring: testing?.consoleMonitoring ?? true,
        coverage: testing?.coverage ?? false,
      },
    },
    projects,
    reporter: [
      [
        'list',
      ],
      [
        'html',
        {
          open: 'never',
        },
      ],
    ],
    retries,
    testDir,
    testMatch,
    use: {
      baseURL,
      trace: 'on-first-retry',
      ...use,
    },
    webServer,
    workers,
  })
}
