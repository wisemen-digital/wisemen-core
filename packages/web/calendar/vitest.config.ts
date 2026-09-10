import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
    },
  },
})
