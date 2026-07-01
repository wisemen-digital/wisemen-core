import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error This works
import postcssPrefixSelector from 'postcss-prefix-selector'
import { defineConfig } from 'vitepress'

import { getPackagesSidebar } from '../navigation/navigation.utils'
import { DOC_PATHS } from '../navigation/paths'
import { API_PLAYBOOK_NAVIGATION } from '../stacks/api/playbook/apiPlaybook.navigation'
import { WEB_PLAYBOOK_NAVIGATION } from '../stacks/web/playbook/webPlaybook.navigation'
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
    'stacks/web/:slug*': 'web/:slug*',
    'stacks/api/:slug*': 'api/:slug*',
  },
  description: 'The central repository of Wisemen for all internal Vue packages.',
  themeConfig: {
    nav: [
      {
        text: 'Stacks',
        items: [
          {
            text: 'WEB',
            link: DOC_PATHS.web,
          },
          {
            text: 'API',
            link: DOC_PATHS.api,
          },
        ],
      },
    ],

    sidebar: {
      '/stacks/': [
        {
          text: 'Stacks',
          items: [
            {
              text: 'Overview',
              link: DOC_PATHS.stacks,
            },
            {
              text: 'WEB',
              link: DOC_PATHS.web,
            },
            {
              text: 'WEB Playbook',
              link: DOC_PATHS.webPlaybook,
            },
            {
              text: 'API',
              link: DOC_PATHS.api,
            },
            {
              text: 'API Playbook',
              link: DOC_PATHS.apiPlaybook,
            },
          ],
        },
      ],
      '/web/playbook/': [
        WEB_PLAYBOOK_NAVIGATION,
      ],
      '/api/playbook/': [
        API_PLAYBOOK_NAVIGATION,
      ],
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
        '@': resolve(__dirname, '../../packages/web/design-system/src'),
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
      tailwindcss() as any,
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
