// @ts-check
import {
  createIndependentModules,
  projectStructurePlugin,
} from 'eslint-plugin-project-structure'

import type { LintConfig } from '@/types/lint.type'

const ALWAYS_ALLOWED_IMPORTS = [
  'virtual:pwa-register/vue',
  'src/modules/*/index.ts',
  'src/modules/*/components.ts',
  'tests/**',
]

export const independentModulesConfig = createIndependentModules({
  modules: [
    {
      name: 'Tests folder',
      allowImportsFrom: [
        ...ALWAYS_ALLOWED_IMPORTS,
        [
          'src/**',
          '!src/modules/**',
        ],
      ],
      errorMessage:
        '🔥 The `tests` folder cannot import items from the `modules` folder. 🔥',
      pattern: [
        [
          'tests/**',
        ],

      ],
    },

    {
      name: 'Root folder',
      allowImportsFrom: [
        '**',
      ],
      errorMessage:
        '🔥 The `root` should be able to import anything. 🔥',
      pattern: [
        [
          '**',
          '!src/**',
        ],

      ],
    },

    {
      name: 'Source folder',
      allowImportsFrom: [
        ...ALWAYS_ALLOWED_IMPORTS,
        [
          'src/**',
          '!src/modules/**',
        ],
      ],
      errorMessage:
        '🔥 The `source` folder cannot import items from the `modules` folder. 🔥',
      pattern: [
        [
          '!src/modules/**',
        ],

      ],
    },
    {
      name: 'Features',
      allowImportsFrom: [
        ...ALWAYS_ALLOWED_IMPORTS,
        '{family_3}/**',
        [
          'src/**',
          '!src/modules/**',
        ],
        [
          'src/**',
          '!src/modules/**/use-cases/**',
        ],
      ],
      errorMessage:
        '🔥 Everything in the use cases folder is encapsulated, you cannot import from outside the folder. 🔥',
      pattern: 'src/modules/*/use-cases/**',
    },
    {
      name: 'Modules',
      allowImportsFrom: [
        ...ALWAYS_ALLOWED_IMPORTS,
        '{family_3}/**',
        [
          'src/**',
          '!src/modules/**',
        ],

      ],
      errorMessage:
        '🔥 Everything in the modules folder is encapsulated, you cannot import from outside the folder. 🔥',
      pattern: [
        'src/modules/**',
      ],
    },
  ],
})

export const modulesConfig: LintConfig = {
  name: 'independent-modules',
  files: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
    '**/*.vue',
  ],
  plugins: {
    'project-structure': projectStructurePlugin,
  },
  rules: {
    // If you have many rules in a separate file.
    'project-structure/independent-modules': [
      'error',
      independentModulesConfig,
    ],
  },
}
