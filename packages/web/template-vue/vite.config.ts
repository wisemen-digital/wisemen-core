import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      name: 'vue-core',
      cssFileName: 'style',
      entry: [
        resolve(__dirname, 'src/index.ts'),
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
        'vue-i18n',
        'vue-router',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          'vue-i18n': 'VueI18n',
          'vue-router': 'VueRouter',
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
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
      '@': resolve(projectRootDir, 'src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
})
