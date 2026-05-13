import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      name: 'vue-core-pdf',
      cssFileName: 'style',
      entry: {
        html2pdf: resolve(__dirname, 'src/html2pdf/index.ts'),
        index: resolve(__dirname, 'src/index.ts'),
      },
      fileName: (format, name) => {
        if (format === 'es') {
          return `${name}.js`
        }

        return `${name}.${format}`
      },
    },
    rollupOptions: {
      external: [
        'html2pdf.js',
        'vue',
      ],
      output: {
        globals: {
          'html2pdf.js': 'html2pdf',
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts({
      cleanVueFileName: true,
      exclude: [
        'src/**/*.spec.ts',
      ],
      tsconfigPath: 'tsconfig.build.json',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
    },
  },
})
