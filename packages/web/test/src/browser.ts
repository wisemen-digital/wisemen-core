import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import type { ViteUserConfig } from 'vitest/config'

export interface WebBrowserTestConfigOptions {
  alias: Record<string, string>
  include?: string[]
}

/**
 * The standard Vitest Browser Mode configuration for Vue applications.
 *
 * Browser Mode uses a real Chromium instance through Playwright. It is still
 * a component/integration test runner: it does not start the application or
 * make network calls to a deployed environment.
 */
export function createWebBrowserTestConfig({
  alias,
  include = [
    'src/**/*.spec.ts',
  ],
}: WebBrowserTestConfigOptions): ViteUserConfig {
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias,
    },
    test: {
      browser: {
        enabled: true,
        headless: true,
        instances: [
          {
            browser: 'chromium',
          },
        ],
        provider: playwright(),
      },
      include,
      passWithNoTests: true,
    },
  }
}
