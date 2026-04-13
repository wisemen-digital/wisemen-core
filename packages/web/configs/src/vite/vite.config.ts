/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */

import defu from 'defu'
import type { OutputOptions } from 'rollup'
import type { UserConfig } from 'vite'

function getOutput() {
  return {
    manualChunks: (id: string): string | undefined => {
      // Only chunk actual icon Vue files, not the index file with dynamic imports
      if (id.includes('src/icons/') && id.endsWith('.vue') && !id.includes('icons.ts')) {
        return 'icons'
      }

      if (id.includes('@wisemen/vue-core-components')) {
        return 'vue-core-components'
      }

      if (id.includes('@wisemen/vue-core-api-utils')) {
        return 'vue-core-api-utils'
      }

      if (id.includes('@wisemen/vue-core-telemetry')) {
        return 'vue-core-telemetry'
      }

      return undefined
    },
  } satisfies OutputOptions
}

export function GET_DEFAULT_VITE_CONFIG(envConfig: ViteEnvConfig): Partial<UserConfig> {
  return {
    build: {
      chunkSizeWarningLimit: 1000,
      cssMinify: 'lightningcss',
      minify: 'esbuild',
      rollupOptions: {
        output: getOutput(),
      },
      sourcemap: envConfig.mode !== 'production',
      target: 'esnext',
    },
    css: {
      devSourcemap: true,
    },
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      BUILD_COMMIT: envConfig.BUILD_COMMIT,
      BUILD_NUMBER: envConfig.BUILD_NUMBER,
      BUILD_TIMESTAMP: envConfig.BUILD_TIMESTAMP,
    },
    esbuild: {
      legalComments: 'none',
      target: 'esnext',
      treeShaking: true,
    },
    optimizeDeps: {
      exclude: [
        '@tanstack/vue-query-devtools',
      ],
      include: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'zod',
        'formango',
        'tailwind-merge',
        'superjson',
        'superjson-temporal',
        '@tanstack/vue-query',
        'motion-v',
        'jwt-encode',
        'reka-ui',
        '@wisemen/vue-core-api-utils',
        'oidc-client-ts',
      ],
    },
    plugins: [],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src',
        },
        {
          find: '@tests',
          replacement: '/tests',
        },
      ],
      dedupe: [
        'vue',
        '@wisemen/vue-core-components',
        'reka-ui',
        'motion-v',
      ],
    },
  }
}
export interface ViteEnvConfig {
  BUILD_COMMIT: string
  BUILD_NUMBER: string
  BUILD_TIMESTAMP: string
  mode: string

}

export function viteConfig({
  envConfig,
  overrides,
  plugins,
}: {
  envConfig: ViteEnvConfig
  overrides?: Partial<UserConfig>
  plugins: UserConfig['plugins']
}): UserConfig {
  return defu(overrides, {
    ...GET_DEFAULT_VITE_CONFIG(envConfig),
    plugins,
  }) as UserConfig
}
