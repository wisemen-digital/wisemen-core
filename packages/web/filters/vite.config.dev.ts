import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
    },
  },
  root: projectRootDir,
  server: {
    fs: {
      strict: false,
    },
    port: 5174,
  },
})
