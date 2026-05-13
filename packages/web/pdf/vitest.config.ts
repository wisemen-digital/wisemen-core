import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import vuePlugin from '@vitejs/plugin-vue'
import {
  configDefaults,
  defineConfig,
} from 'vitest/config'

const META_URL = import.meta.url
const projectRootDir = resolve(__dirname)

export default defineConfig({
  plugins: [
    vuePlugin(),
  ],
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
