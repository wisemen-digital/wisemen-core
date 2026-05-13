import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      name: 'vue-core-filters',
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

    rollupOptions: {
      external: [
        '@wisemen/vue-core-actions',
        '@wisemen/vue-core-dates',
        '@wisemen/vue-core-design-system',
        '@wisemen/vue-core-icons',
        '@wisemen/vue-core-utils',
        'formango',
        'vue',
        'vue-i18n',
        'pinia',
      ],
      output: {
        globals: {
          '@wisemen/vue-core-actions': 'VueCoreActions',
          '@wisemen/vue-core-dates': 'VueCoreDates',
          '@wisemen/vue-core-design-system': 'VueCoreDesignSystem',
          '@wisemen/vue-core-icons': 'VueCoreIcons',
          '@wisemen/vue-core-utils': 'VueCoreUtils',
          'formango': 'Formango',
          'pinia': 'Pinia',
          'vue': 'Vue',
          'vue-i18n': 'VueI18n',
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
