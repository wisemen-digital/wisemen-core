import { resolve } from 'node:path'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
      '@repo/icons': resolve(projectRootDir, '../icons/src'),
    },
  },
  test: {
    coverage: {
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.story.ts',
        '**/*.spec.ts',
        '.storybook/',
      ],
      provider: 'v8',
      reporter: [
        'text',
        'json',
        'html',
      ],
    },
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    globals: true,
    projects: [
      {
        name: 'storybook',
        extends: true,
        plugins: [
          storybookTest({
            configDir: resolve(projectRootDir, '.storybook'),
            storybookScript: 'pnpm storybook --no-open',
          }),
        ],
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
          setupFiles: [
            './.storybook/vitest.setup.ts',
          ],
        },
      },
    ],
  },
})
