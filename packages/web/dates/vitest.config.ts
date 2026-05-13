import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  resolve: {
    alias: {
      '#composables': resolve(projectRootDir, 'src/composables'),
      '#models': resolve(projectRootDir, 'src/models'),
      '#transformers': resolve(projectRootDir, 'src/transformers'),
      '#utils': resolve(projectRootDir, 'src/utils'),
      '@': resolve(projectRootDir, 'src'),
    },
  },
})
