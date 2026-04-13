import { resolve } from 'node:path'

import vuePlugin from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

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
    setupFiles: './vitest.setup.ts',
  },
})
