import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      name: 'vue-core-preferences',
      cssFileName: 'style',
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

    rolldownOptions: {
      external: [
        'vue',
        'vue-i18n',
        'reka-ui',
        '@wisemen/vue-core-design-system',
        '@wisemen/vue-core-dates',
        '@wisemen/vue-core-icons',
        '@vueuse/core',
        'highlight-words',
      ],
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
      '#components': resolve(projectRootDir, 'src/components'),
      '#composables': resolve(projectRootDir, 'src/composables'),
      '#context': resolve(projectRootDir, 'src/context'),
      '#sections': resolve(projectRootDir, 'src/sections'),
      '#types': resolve(projectRootDir, 'src/types'),
      '#views': resolve(projectRootDir, 'src/views'),
      '@': resolve(projectRootDir, 'src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
})
