import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import postcssPrefixSelector from 'postcss-prefix-selector'
import { defineConfig } from 'vitepress'

import {
  getPackagesNavigation,
  getPackagesSidebar,
} from '../packages/navigation.utils'
import ComponentPreviewPlugin from './plugins/ComponentPreview'
import ComponentPreviewV1Plugin from './plugins/ComponentPreviewV1'

// @ts-expect-error - Build fails
if (typeof __VUE_PROD_DEVTOOLS__ === 'undefined') {
  // @ts-expect-error - Build fails
  globalThis.__VUE_PROD_DEVTOOLS__ = false
}

const PSEUDO_SELECTOR_REGEX = /(:\S*)$/

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/wisemen-core/docs/',
  title: 'Wisemen Core',
  rewrites: {
    home: 'index',
  },
  description: 'The central repository of Wisemen for all internal Vue packages.',
  themeConfig: {
    nav: [
      {
        text: 'Packages',
        items: [
          ...getPackagesNavigation(),
        ],
      },
    ],

    sidebar: {
      ...getPackagesSidebar(),
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/wisemen-digital/wisemen-core',
      },
    ],
  },
  markdown: {
    preConfig(md) {
      md.use(ComponentPreviewPlugin)
      md.use(ComponentPreviewV1Plugin)
    },
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          postcssPrefixSelector({
            prefix: ':not(:where(.vp-raw *))',
            includeFiles: [
              /vp-doc\.css/,
              /base\.css/,
            ],
            transform(prefix: string, _selector: string) {
              const [
                selector,
                pseudo = '',
              ] = _selector.split(PSEUDO_SELECTOR_REGEX)

              return selector + prefix + pseudo
            },
          }),
        ],
      },
    },
    resolve: {
      alias: {
        '@docs': resolve(__dirname, '../'),
        '@': resolve(__dirname, '../../components/src'),
      },
    },
    server: {
      fs: {
        allow: [
          resolve(__dirname, '../..'),
        ],
      },
    },
    plugins: [
      tailwindcss(),
      {
        name: 'eslint-inspector-spa',
        configureServer(server): void {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/wisemen-core/eslint-inspector' || req.url === '/wisemen-core/eslint-inspector/') {
              req.url = '/wisemen-core/eslint-inspector/index.html'
            }

            next()
          })
        },
      },
    ],
  },
})
