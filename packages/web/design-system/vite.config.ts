import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const projectRootDir = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      name: 'vue-core-design-system',
      cssFileName: 'index',
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
        '@vueuse/core',
        '@vueuse/router',
        'vue',
        'vue-i18n',
        'vue-router',
        'reka-ui',
        'temporal-polyfill',
      ],
      output: {
        // Maps external packages to global variable names for UMD builds (e.g. window.Vue).
        // Only relevant when consumed via <script> tags without a bundler.
        globals: {
          '@vueuse/core': 'VueUseCore',
          '@vueuse/router': 'VueUseRouter',
          'reka-ui': 'RekaUI',
          'temporal-polyfill': 'Temporal',
          'vue': 'Vue',
          'vue-i18n': 'VueI18n',
          'vue-router': 'VueRouter',
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      '@wisemen/vue-core-icons',
    ],
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
