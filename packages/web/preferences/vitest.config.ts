import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  resolve: {
    alias: {
      '#components': resolve(projectRootDir, 'src/components'),
      '#composables': resolve(projectRootDir, 'src/composables'),
      '#context': resolve(projectRootDir, 'src/context'),
      '#sections': resolve(projectRootDir, 'src/sections'),
      '#types': resolve(projectRootDir, 'src/types'),
      '#views': resolve(projectRootDir, 'src/views'),
      '@': resolve(projectRootDir, 'src'),
    },
  },
})
