import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import type { ViteUserConfig } from 'vitest/config'

export interface WebBrowserTestConfigOptions {
  alias: Record<string, string>
  include?: string[]
}

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
