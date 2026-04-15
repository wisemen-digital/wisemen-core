import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  configDefaults,
  defineConfig,
} from 'vitest/config'

const META_URL = import.meta.url
const projectRootDir = resolve(__dirname)

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
    },
  },

  test: {
    environment: 'jsdom',
    exclude: [
      ...configDefaults.exclude,
    ],
    root: fileURLToPath(new URL('./', META_URL)),
  },
})
