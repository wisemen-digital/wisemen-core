import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      name: 'vue-core-dates',
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/locales.ts'),
      ],
      fileName: (format, name) => {
        if (format === 'es') {
          return `${name}.js`
        }

        return `${name}.${format}`
      },
    },

    rollupOptions: {
      external: [
        'vue',
        'temporal-polyfill',
      ],
      output: {
        globals: {
          'temporal-polyfill': 'TemporalPolyfill',
          'vue': 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts({
      cleanVueFileName: true,
      exclude: [
        'src/**/*.story.vue',
        'src/**/*.spec.ts',
      ],
      tsconfigPath: 'tsconfig.build.json',
    }),
  ],
  resolve: {
    alias: {
      '#composables': resolve(projectRootDir, 'src/composables'),
      '#models': resolve(projectRootDir, 'src/models'),
      '#transformers': resolve(projectRootDir, 'src/transformers'),
      '#utils': resolve(projectRootDir, 'src/utils'),
      '@': resolve(projectRootDir, 'src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
})
