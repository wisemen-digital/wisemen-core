import {
  dirname,
  resolve,
} from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/vue3-vite'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  core: {
    disableWhatsNewNotifications: true,
  },
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: resolve(dirname(fileURLToPath(import.meta.url)), '../tsconfig.app.json') as `tsconfig${string}.json`,
      },
    },
  },
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.story.@(js|jsx|mjs|ts|tsx)',
  ],
  viteFinal(config) {
    const pluginName = 'storybook:vue-component-meta'
    const plugins = config.plugins as any[]
    const idx = plugins.findIndex((x) => x?.name === pluginName)

    if (idx !== -1) {
      const plugin = plugins[idx]

      plugins.splice(idx, 1)

      plugins.push(plugin)
    }

    config.optimizeDeps = {
      ...config.optimizeDeps,
      force: true,
    }

    return config
  },
}

export default config
