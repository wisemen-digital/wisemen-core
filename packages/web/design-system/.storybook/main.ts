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
  // Serves storybook-assets/wisemen-logo.png as ./wisemen-logo.png for the
  // manager theme's brandImage (see manager.ts).
  staticDirs: [
    '../storybook-assets',
  ],
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.story.@(js|jsx|mjs|ts|tsx)',
  ],
  viteFinal(config) {
    // Remove dts plugin — it's only needed for library builds, not Storybook
    const plugins = (config.plugins as any[]).filter((x) => x?.name !== 'vite:dts')

    const metaPluginName = 'storybook:vue-component-meta'
    const metaIdx = plugins.findIndex((x) => x?.name === metaPluginName)

    if (metaIdx !== -1) {
      const plugin = plugins[metaIdx]

      plugins.splice(metaIdx, 1)

      plugins.push(plugin)
    }

    config.plugins = plugins
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        'formango',
      ],
    }

    return config
  },
}

export default config
